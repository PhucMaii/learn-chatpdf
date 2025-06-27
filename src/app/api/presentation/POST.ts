import { NextRequest, NextResponse } from 'next/server';
import pptxgen from 'pptxgenjs';
import { generatePresentationPrompt, generatePrompt } from '@/lib/prompt';
import { openai } from '../utils/openai';
import { getContext } from '@/lib/context';
import { medias } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';

interface PresentationRequest {
  prompt: string;
  slideCount: number;
  tone: string;
  style: string;
  projectId: number;
}

interface SlideContent {
  type: string;
  content: any;
  styles?: any;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface Slide {
  slide: SlideContent[];
}

interface PresentationData {
  title: string;
  slides: Slide[];
}

// Helper function to convert percentage string to decimal
const convertPosition = (value: string | number): number => {
  if (typeof value === 'string' && value.includes('%')) {
    const percentage = parseFloat(value.replace('%', ''));
    return percentage / 100;
  }
  return typeof value === 'number' ? value : parseFloat(value as string);
};

// Helper function to convert position object
const convertPositionObject = (position: any) => {
  return {
    x: convertPosition(position.x),
    y: convertPosition(position.y),
    w: convertPosition(position.w),
    h: convertPosition(position.h),
  };
};

const handler = async (request: NextRequest) => {
  try {
    const body: PresentationRequest = await request.json();
    const { projectId, prompt, slideCount, tone, style } = body;

    // Validate required fields
    if (!prompt || !slideCount || !tone || !style || !projectId) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: prompt, slideCount, tone, style, projectId',
        },
        { status: 400 },
      );
    }

    // Validate slide count
    if (slideCount < 1 || slideCount > 50) {
      return NextResponse.json(
        { error: 'Slide count must be between 1 and 50' },
        { status: 400 },
      );
    }

    // Generate presentation using the prompt
    const presentationPrompt = generatePresentationPrompt(
      prompt,
      slideCount,
      tone,
      style,
    );

    const dbMedias = await db
      .select()
      .from(medias)
      .where(eq(medias.projectId, projectId));
    const context = await getContext(presentationPrompt, dbMedias);
    const feedPrompt: any = generatePrompt(context, 'English');

    console.log('Generating presentation with AI...');
    const aiResponse = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        feedPrompt,
        {
          role: 'user',
          content: presentationPrompt,
        },
      ],
    });

    const completionData = await aiResponse.json();
    console.log('AI response received, parsing content...');

    let formattedMessages: PresentationData;
    try {
      console.log(completionData.choices[0].message.content);
      formattedMessages = JSON.parse(completionData.choices[0].message.content);
    } catch (parseError) {
      console.log('Failed to parse AI response:', parseError);
      throw new Error('Invalid AI response format');
    }

    // Validate the parsed data
    if (!formattedMessages.slides || !Array.isArray(formattedMessages.slides)) {
      throw new Error('Invalid slides data structure');
    }

    const slides = formattedMessages.slides;
    console.log(`Creating presentation with ${slides.length} slides...`);

    const pres = new pptxgen();

    // Set presentation properties
    pres.author = 'AI Presentation Generator';
    pres.company = 'LearnChatPDF';
    pres.title = formattedMessages.title || 'Generated Presentation';
    pres.subject = prompt;

    // Set layout to wide format for better content display
    pres.layout = 'LAYOUT_WIDE';

    // Apply style based on user selection
    const getStyleConfig = () => {
      switch (style) {
        case 'modern':
          return {
            primaryColor: '4F46E5',
            secondaryColor: '6366F1',
            accentColor: '8B5CF6',
            backgroundColor: 'FFFFFF',
            textColor: '1F2937',
          };
        case 'minimal':
          return {
            primaryColor: '374151',
            secondaryColor: '6B7280',
            accentColor: '9CA3AF',
            backgroundColor: 'FFFFFF',
            textColor: '374151',
          };
        case 'colorful':
          return {
            primaryColor: 'EC4899',
            secondaryColor: '8B5CF6',
            accentColor: 'F59E0B',
            backgroundColor: 'FFFFFF',
            textColor: '1F2937',
          };
        case 'elegant':
          return {
            primaryColor: '059669',
            secondaryColor: '10B981',
            accentColor: '34D399',
            backgroundColor: 'FFFFFF',
            textColor: '1F2937',
          };
        case 'corporate':
          return {
            primaryColor: '1F2937',
            secondaryColor: '4B5563',
            accentColor: '6B7280',
            backgroundColor: 'FFFFFF',
            textColor: '1F2937',
          };
        default:
          return {
            primaryColor: '4F46E5',
            secondaryColor: '6366F1',
            accentColor: '8B5CF6',
            backgroundColor: 'FFFFFF',
            textColor: '1F2937',
          };
      }
    };

    const styleConfig = getStyleConfig();

    // Define master slide for consistent styling
    pres.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: styleConfig.backgroundColor },
      objects: [
        {
          text: {
            text: 'AI Generated Presentation',
            options: {
              x: 0.5,
              y: 0.1,
              w: 9,
              h: 0.5,
              fontSize: 12,
              color: styleConfig.secondaryColor,
              align: 'center',
              valign: 'middle',
            },
          },
        },
      ],
    });

    // Create title slide
    const titleSlide = pres.addSlide({ masterName: 'MASTER_SLIDE' });

    // Add main title
    titleSlide.addText(formattedMessages.title || 'AI Generated Presentation', {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 1.5,
      fontSize: 44,
      color: styleConfig.primaryColor,
      bold: true,
      align: 'center',
      valign: 'middle',
    });

    // Add subtitle
    titleSlide.addText(prompt, {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 18,
      color: styleConfig.secondaryColor,
      align: 'center',
      valign: 'middle',
    });

    // Add metadata
    const metadataText = `Tone: ${tone.charAt(0).toUpperCase() + tone.slice(1)} | Style: ${style.charAt(0).toUpperCase() + style.slice(1)} | Generated by AI`;
    titleSlide.addText(metadataText, {
      x: 0.5,
      y: 4.5,
      w: 9,
      h: 0.5,
      fontSize: 12,
      color: '9CA3AF',
      align: 'center',
      valign: 'middle',
    });

    // Add slide number
    titleSlide.slideNumber = {
      x: 0.5,
      y: '90%',
      color: styleConfig.secondaryColor,
      fontSize: 10,
    };

    // Create content slides based on AI-generated content
    let successfulSlides = 0;
    for (let i = 0; i < slides.length; i++) {
      const slideContent = slides[i].slide;
      console.log(slideContent);

      // Skip slides with no content
      if (
        !slideContent ||
        !Array.isArray(slideContent) ||
        slideContent.length === 0
      ) {
        console.log(`Skipping slide ${i + 1} - no content`);
        continue;
      }

      try {
        const slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });

        console.log(
          `Processing slide ${i + 1} with ${slideContent.length} elements...`,
        );

        let slideHasContent = false;

        for (let j = 0; j < slideContent.length; j++) {
          const content: SlideContent = slideContent[j];

          // Skip invalid content
          if (!content || !content.type || !content.position) {
            console.log(
              `Skipping invalid content at index ${j} on slide ${i + 1}`,
            );
            continue;
          }

          // Preprocess content to fix common issues
          if (content.type === 'image') {
            // Ensure image content is safe
            if (typeof content.content === 'string') {
              const imageContent = content.content.trim();
              // If it looks like a placeholder or problematic path, convert to placeholder
              if (
                imageContent.includes('_placeholder') ||
                imageContent.includes('placeholder') ||
                !imageContent.includes('.') ||
                imageContent.length < 10 ||
                imageContent.includes('brain_') ||
                imageContent.includes('icon_') ||
                imageContent.includes('logo_')
              ) {
                content.content = 'placeholder';
                console.log(
                  `Converted problematic image content "${imageContent}" to placeholder on slide ${i + 1}`,
                );
              }
            }
          }

          try {
            switch (content.type) {
              case 'text':
                const convertedTextPos = convertPositionObject(
                  content.position,
                );
                const textOptions: any = {
                  x: convertedTextPos.x,
                  y: convertedTextPos.y,
                  w: convertedTextPos.w,
                  h: convertedTextPos.h,
                  fontSize: content.styles?.fontSize || 18,
                  color: content.styles?.color || styleConfig.textColor,
                  align: content.styles?.align || 'left',
                  valign: content.styles?.valign || 'top',
                  autoFit: true,
                  margin: 0.1,
                };

                // Add font weight if specified
                if (content.styles?.fontWeight === 'bold') {
                  textOptions.bold = true;
                }

                // Add bullet points if specified
                if (content.styles?.bullet) {
                  textOptions.bullet = content.styles.bullet;
                }

                // Add line spacing for better readability
                if (content.styles?.fontSize && content.styles.fontSize >= 16) {
                  textOptions.lineSpacing = 1.2;
                }

                slide.addText(content.content, textOptions);
                slideHasContent = true;
                break;

              case 'shape':
                const convertedShapePos = convertPositionObject(
                  content.position,
                );
                const shapeOptions: any = {
                  x: convertedShapePos.x,
                  y: convertedShapePos.y,
                  w: convertedShapePos.w,
                  h: convertedShapePos.h,
                };

                // Add fill color if specified
                if (content.styles?.fill) {
                  shapeOptions.fill = { color: content.styles.fill };
                }

                // Add line styling if specified
                if (content.styles?.line) {
                  shapeOptions.line = content.styles.line;
                }

                // Add shadow for depth (for accent elements)
                if (content.styles?.shadow) {
                  shapeOptions.shadow = {
                    type: 'outer',
                    color: '000000',
                    blur: 3,
                    offset: 2,
                    angle: 45,
                  };
                }

                // Add rounded corners for modern look (default for content boxes)
                if (content.styles?.rounded !== false) {
                  shapeOptions.radius = 0.1; // Default rounded corners for modern design
                }

                slide.addShape(content.content, shapeOptions);
                slideHasContent = true;
                break;

              case 'table':
                const convertedTablePos = convertPositionObject(
                  content.position,
                );
                const tableOptions: any = {
                  x: convertedTablePos.x,
                  y: convertedTablePos.y,
                  w: convertedTablePos.w,
                  h: convertedTablePos.h,
                  colW: content.styles?.colW || [2, 2, 2],
                  border: content.styles?.border || { pt: 1, color: 'D1D5DB' },
                  align: content.styles?.align || 'center',
                  fontSize: 14,
                  color: styleConfig.textColor,
                  // Add header styling
                  headerRows: 1,
                  headerColor: styleConfig.primaryColor,
                  headerFontColor: 'FFFFFF',
                  headerFontSize: 16,
                  headerFontBold: true,
                };

                // Add alternating row colors for better readability
                if (content.content.length > 1) {
                  tableOptions.alternateRows = true;
                  tableOptions.alternateColor = 'F8FAFC';
                }

                slide.addTable(content.content, tableOptions);
                slideHasContent = true;
                break;

              case 'chart':
                try {
                  const convertedChartPos = convertPositionObject(
                    content.position,
                  );
                  // For now, create a simple chart placeholder instead of complex charts
                  // This avoids the pptxgenjs chart API issues
                  slide.addShape('rect', {
                    x: convertedChartPos.x,
                    y: convertedChartPos.y,
                    w: convertedChartPos.w,
                    h: convertedChartPos.h,
                    fill: { color: 'F8FAFC' },
                    line: { color: 'E2E8F0', width: 2 },
                  });

                  // Add chart title
                  const chartTitle =
                    content.content.options?.title || 'Data Chart';
                  slide.addText(chartTitle, {
                    x: convertedChartPos.x,
                    y: convertedChartPos.y + 0.02,
                    w: convertedChartPos.w,
                    h: 0.05,
                    fontSize: 16,
                    color: styleConfig.primaryColor,
                    bold: true,
                    align: 'center',
                    valign: 'top',
                  });

                  // Add placeholder text
                  slide.addText(
                    'Chart data will be displayed here\n(Add your data visualization)',
                    {
                      x: convertedChartPos.x + 0.05,
                      y: convertedChartPos.y + 0.1,
                      w: convertedChartPos.w - 0.1,
                      h: convertedChartPos.h - 0.15,
                      fontSize: 14,
                      color: '64748B',
                      align: 'center',
                      valign: 'middle',
                    },
                  );

                  slideHasContent = true;
                } catch (chartError) {
                  console.log(
                    `Error creating chart placeholder on slide ${i + 1}:`,
                    chartError,
                  );
                  const convertedChartPosError = convertPositionObject(
                    content.position,
                  );
                  // Create a simple placeholder shape
                  slide.addShape('rect', {
                    x: convertedChartPosError.x,
                    y: convertedChartPosError.y,
                    w: convertedChartPosError.w,
                    h: convertedChartPosError.h,
                    fill: { color: 'F3F4F6' },
                    line: { color: 'D1D5DB', width: 1 },
                  });
                  slide.addText('Chart Placeholder', {
                    x: convertedChartPosError.x,
                    y:
                      convertedChartPosError.y +
                      convertedChartPosError.h / 2 -
                      0.02,
                    w: convertedChartPosError.w,
                    h: 0.04,
                    fontSize: 12,
                    color: '6B7280',
                    align: 'center',
                    valign: 'middle',
                  });
                  slideHasContent = true;
                }
                break;

              case 'data visualization':
                try {
                  const convertedDataVizPos = convertPositionObject(
                    content.position,
                  );
                  // Handle data visualization as a table with enhanced styling
                  const dataVizOptions: any = {
                    x: convertedDataVizPos.x,
                    y: convertedDataVizPos.y,
                    w: convertedDataVizPos.w,
                    h: convertedDataVizPos.h,
                    colW: content.styles?.colW || [2, 2, 2],
                    border: content.styles?.border || {
                      pt: 2,
                      color: styleConfig.primaryColor,
                    },
                    align: content.styles?.align || 'center',
                    fontSize: 14,
                    color: styleConfig.textColor,
                    // Enhanced styling for data visualization
                    headerRows: 1,
                    headerColor: styleConfig.primaryColor,
                    headerFontColor: 'FFFFFF',
                    headerFontSize: 16,
                    headerFontBold: true,
                    // Add visual enhancements
                    alternateRows: true,
                    alternateColor: 'F8FAFC',
                  };

                  // Add a title for the data visualization
                  const vizTitle = 'Data Analysis';
                  slide.addText(vizTitle, {
                    x: convertedDataVizPos.x,
                    y: convertedDataVizPos.y - 0.04,
                    w: convertedDataVizPos.w,
                    h: 0.03,
                    fontSize: 16,
                    color: styleConfig.primaryColor,
                    bold: true,
                    align: 'center',
                    valign: 'bottom',
                  });

                  // Add the data table
                  slide.addTable(content.content, dataVizOptions);
                  slideHasContent = true;
                } catch (dataVizError) {
                  console.log(
                    `Error creating data visualization on slide ${i + 1}:`,
                    dataVizError,
                  );
                  const convertedDataVizPosError = convertPositionObject(
                    content.position,
                  );
                  // Fallback to a simple placeholder
                  slide.addShape('rect', {
                    x: convertedDataVizPosError.x,
                    y: convertedDataVizPosError.y,
                    w: convertedDataVizPosError.w,
                    h: convertedDataVizPosError.h,
                    fill: { color: 'F0F9FF' },
                    line: { color: styleConfig.primaryColor, width: 2 },
                  });
                  slide.addText('Data Visualization', {
                    x: convertedDataVizPosError.x,
                    y:
                      convertedDataVizPosError.y +
                      convertedDataVizPosError.h / 2 -
                      0.02,
                    w: convertedDataVizPosError.w,
                    h: 0.04,
                    fontSize: 14,
                    color: styleConfig.primaryColor,
                    bold: true,
                    align: 'center',
                    valign: 'middle',
                  });
                  slideHasContent = true;
                }
                break;

              case 'image':
                // Handle different types of image content
                const imageContent = content.content;

                // Check if it's a placeholder or actual image path
                const isPlaceholder =
                  imageContent === 'placeholder' ||
                  imageContent === 'placeholder.png' ||
                  imageContent === 'placeholder.jpg' ||
                  imageContent === 'placeholder.jpeg' ||
                  imageContent.includes('placeholder') ||
                  imageContent.includes('_placeholder') ||
                  !imageContent.includes('.') || // No file extension
                  imageContent.length < 10; // Very short content likely placeholder

                if (isPlaceholder) {
                  // Create a placeholder shape with dashed border
                  slide.addShape('rect', {
                    x: content.position.x,
                    y: content.position.y,
                    w: content.position.w,
                    h: content.position.h,
                    fill: { color: content.styles?.fill || 'E5E7EB' },
                    line: {
                      color: content.styles?.line?.color || 'D1D5DB',
                      width: content.styles?.line?.width || 2,
                      dashType: content.styles?.line?.dashType || 'dash',
                    },
                  });

                  // Add placeholder text
                  const placeholderText =
                    content.styles?.placeholderText || 'Image Placeholder';
                  slide.addText(placeholderText, {
                    x: content.position.x,
                    y: content.position.y + content.position.h / 2 - 0.2,
                    w: content.position.w,
                    h: 0.4,
                    fontSize: 12,
                    color: '6B7280',
                    align: 'center',
                    valign: 'middle',
                  });

                  slideHasContent = true;
                } else {
                  // For actual images, try to add them but with error handling
                  try {
                    slide.addImage({
                      path: imageContent,
                      x: content.position.x,
                      y: content.position.y,
                      w: content.position.w,
                      h: content.position.h,
                    });
                    slideHasContent = true;
                  } catch (imageError) {
                    console.log(
                      `Error adding image "${imageContent}" on slide ${i + 1}:`,
                      imageError,
                    );
                    // Fallback to placeholder if image fails
                    slide.addShape('rect', {
                      x: content.position.x,
                      y: content.position.y,
                      w: content.position.w,
                      h: content.position.h,
                      fill: { color: 'E5E7EB' },
                      line: {
                        color: 'D1D5DB',
                        width: 2,
                        dashType: 'dash',
                      },
                    });
                    slide.addText('Image Not Found', {
                      x: content.position.x,
                      y: content.position.y + content.position.h / 2 - 0.2,
                      w: content.position.w,
                      h: 0.4,
                      fontSize: 12,
                      color: '6B7280',
                      align: 'center',
                      valign: 'middle',
                    });
                    slideHasContent = true;
                  }
                }
                break;

              default:
                console.log(`Unknown content type: ${content.type}`);
                break;
            }
          } catch (elementError) {
            console.log(
              `Error processing element ${j} on slide ${i + 1}:`,
              elementError,
            );
            // Continue with other elements instead of failing completely
          }
        }

        // Only count slides that have actual content
        if (slideHasContent) {
          // Add slide number to each slide
          slide.slideNumber = {
            x: 0.5,
            y: '90%',
            color: styleConfig.secondaryColor,
            fontSize: 10,
          };
          successfulSlides++;
        } else {
          console.log(
            `Slide ${i + 1} has no valid content, but keeping it for structure`,
          );
          // Add slide number even if no content was added
          slide.slideNumber = {
            x: 0.5,
            y: '90%',
            color: styleConfig.secondaryColor,
            fontSize: 10,
          };
        }
      } catch (slideError) {
        console.log(`Error creating slide ${i + 1}:`, slideError);
        // Continue with other slides instead of failing completely
      }
    }

    console.log(
      `Successfully created ${successfulSlides} slides out of ${slides.length} requested`,
    );

    // If no slides were created successfully, create a fallback slide
    if (successfulSlides === 0) {
      console.log('No slides created successfully, adding fallback slide');
      const fallbackSlide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
      fallbackSlide.addText('Content Generation', {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 1.5,
        fontSize: 44,
        color: styleConfig.primaryColor,
        bold: true,
        align: 'center',
        valign: 'middle',
      });
      fallbackSlide.addText(
        'Unable to generate content from the provided document. Please try again with different parameters.',
        {
          x: 0.5,
          y: 3,
          w: 9,
          h: 2,
          fontSize: 18,
          color: styleConfig.secondaryColor,
          align: 'center',
          valign: 'middle',
        },
      );
      fallbackSlide.slideNumber = {
        x: 0.5,
        y: '90%',
        color: styleConfig.secondaryColor,
        fontSize: 10,
      };
    }

    console.log('Generating PowerPoint file...');

    // Generate the PowerPoint file as a buffer
    const fileBuffer = (await pres.write({
      outputType: 'nodebuffer',
    })) as Buffer;

    console.log('Presentation generated successfully!');

    // Create response with proper headers for file download
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="presentation-${Date.now()}.pptx"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.log('Something went wrong while generating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate presentation. Please try again.' },
      { status: 500 },
    );
  }
};

export default handler;
