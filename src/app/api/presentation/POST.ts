import { getTitleSlide } from '@/lib/presentation-template/modern';
import { NextRequest, NextResponse } from 'next/server';
import pptxgen from 'pptxgenjs';
// Commented out unused imports for now since AI generation is disabled
// import { generatePresentationPrompt, generatePrompt } from '@/lib/prompt';
// import { openai } from '../utils/openai';
// import { getContext } from '@/lib/context';
// import { medias } from '@/lib/db/schema';
// import { eq } from 'drizzle-orm';
// import { db } from '@/lib/db';

interface PresentationRequest {
  prompt: string;
  slideCount: number;
  tone: string;
  style: string;
  projectId: number;
}

// Commented out unused interfaces for now
// interface SlideContent {
//   type: string;
//   content: any;
//   styles?: any;
//   position: {
//     x: number;
//     y: number;
//     w: number;
//     h: number;
//   };
// }

// interface Slide {
//   slide: SlideContent[];
// }

// interface PresentationData {
//   title: string;
//   slides: Slide[];
// }

// Helper function to convert percentage string to decimal (commented out for now)
// const convertPosition = (value: string | number): number => {
//   if (typeof value === 'string' && value.includes('%')) {
//     const percentage = parseFloat(value.replace('%', ''));
//     return percentage / 100;
//   }
//   return typeof value === 'number' ? value : parseFloat(value as string);
// };

// Helper function to convert position object (commented out for now)
// const convertPositionObject = (position: any) => {
//   return {
//     x: convertPosition(position.x),
//     y: convertPosition(position.y),
//     w: convertPosition(position.w),
//     h: convertPosition(position.h),
//   };
// };

const handler = async (request: NextRequest) => {
  try {
    const body: PresentationRequest = await request.json();
    const { projectId, prompt, slideCount, tone, style } = body;

    // Generate a simple corporate deck for now
    const deck = generateCorporateDeck();

    const deckBuffer = (await deck.write({
      outputType: 'nodebuffer',
    })) as Buffer;

    return new NextResponse(deckBuffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="presentation-${Date.now()}.pptx"`,
        'Content-Length': deckBuffer.length.toString(),
      },
    });

    // The rest of the AI-generated content code (commented out for now to fix the immediate error)
    /*
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

    // ... rest of the AI generation code
    */
  } catch (error: any) {
    console.log('Something went wrong while generating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate presentation. Please try again.' },
      { status: 500 },
    );
  }
};

export default handler;

// Fixed addSlideNumber function with proper typing
const addSlideNumber = (slide: any, x = '90%', y = '95%', opts = {}) => {
  slide.addText(`Slide ${slide.number || 1}`, {
    x,
    y,
    w: '10%',
    h: '5%',
    fontSize: 10,
    color: '888888',
    align: 'right',
    ...opts,
  });
};

/**
 * CorporateDeckTemplate function to generate a PptxGenJS presentation.
 * This function encapsulates the logic for a specific presentation theme.
 * @returns {PptxGenJS} A PptxGenJS presentation instance.
 */
const generateCorporateDeck = () => {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // Widescreen layout

  const colors = {
    primary: '#0065ff', // Blue
    secondary: '#e6e6e6', // Skin color
    background: '#eff7ff', // Light Gray
    textDark: '#25282a',
    textLight: '#414244',
    accentShape: '#E0E0E0',
  };
  const font = 'Roboto'; // Using a common font for broad compatibility

  // --- Define Master Slides ---
  // // Master 1: Title Slide
  // pptx.defineSlideMaster({
  //   title: 'TITLE_MASTER_CORPORATE',
  //   bkgd: colors.background,
  //   objects: [
  //     {
  //       rect: {
  //         x: 0,
  //         y: 0,
  //         w: '100%',
  //         h: 1.2,
  //         fill: { color: colors.primary },
  //       },
  //     },
  //     {
  //       text: {
  //         text: '{{title}}',
  //         options: {
  //           x: 0.5,
  //           y: 0.2,
  //           w: '90%',
  //           h: 0.8,
  //           fontSize: 48,
  //           color: colors.textLight,
  //           align: 'center',
  //           fontFace: font,
  //           bold: true,
  //         },
  //       },
  //     },
  //     {
  //       text: {
  //         text: '{{subtitle}}',
  //         options: {
  //           x: 0.5,
  //           y: 1.5,
  //           w: '90%',
  //           h: 0.5,
  //           fontSize: 24,
  //           color: colors.textDark,
  //           align: 'center',
  //           fontFace: font,
  //         },
  //       },
  //     },
  //   ],
  // });

  // // Master 2: Content Slide with Header and Footer
  // pptx.defineSlideMaster({
  //   title: 'CONTENT_MASTER_CORPORATE',
  //   bkgd: colors.background,
  //   objects: [
  //     {
  //       rect: {
  //         x: 0,
  //         y: 0,
  //         w: '100%',
  //         h: 0.75,
  //         fill: { color: colors.primary },
  //       },
  //     },
  //     {
  //       text: {
  //         text: '{{slideTitle}}',
  //         options: {
  //           x: 0.5,
  //           y: 0.15,
  //           w: '90%',
  //           h: 0.45,
  //           fontSize: 28,
  //           color: colors.textLight,
  //           fontFace: font,
  //           bold: true,
  //         },
  //       },
  //     },
  //   ],
  // });

  // --- Add Slides ---

  getTitleSlide(pptx, colors);
  // // Slide 1: Title Slide
  // const slide1 = pptx.addSlide({ masterName: 'TITLE_MASTER_CORPORATE' });
  // slide1.addText('Annual Business Review', { placeholder: 'title' });
  // slide1.addText('Driving Growth in a Dynamic Market', {
  //   placeholder: 'subtitle',
  // });
  // addSlideNumber(slide1);

  // // Slide 2: Executive Summary
  // const slide2 = pptx.addSlide({ masterName: 'CONTENT_MASTER_CORPORATE' });
  // slide2.addText('Executive Summary', { placeholder: 'slideTitle' });
  // slide2.addText(
  //   [
  //     {
  //       text: 'Key Highlights:',
  //       options: { bold: true, fontSize: 20, color: colors.primary },
  //     },
  //     {
  //       text: '\n• Strong revenue growth of 15% year-over-year.',
  //       options: { fontSize: 18 },
  //     },
  //     {
  //       text: '\n• Successful market expansion into two new regions.',
  //       options: { fontSize: 18 },
  //     },
  //     {
  //       text: '\n• Enhanced operational efficiency, reducing costs by 8%.',
  //       options: { fontSize: 18 },
  //     },
  //     {
  //       text: '\n\nChallenges & Opportunities:',
  //       options: { bold: true, fontSize: 20, color: colors.primary },
  //     },
  //     {
  //       text: '\n• Increased competitive pressure requires innovation.',
  //       options: { fontSize: 18 },
  //     },
  //     {
  //       text: '\n• Untapped market segments for future growth.',
  //       options: { fontSize: 18 },
  //     },
  //   ],
  //   { x: 0.5, y: 1.2, w: 9, h: 5.5, fontFace: font, color: colors.textDark },
  // );
  // addSlideNumber(slide2);

  // // Slide 3: Financial Performance (Simple Chart Placeholder)
  // const slide3 = pptx.addSlide({ masterName: 'CONTENT_MASTER_CORPORATE' });
  // slide3.addText('Financial Performance Overview', {
  //   placeholder: 'slideTitle',
  // });

  // // Add a simple placeholder for chart
  // slide3.addShape(pptx.ShapeType.rect, {
  //   x: 0.7,
  //   y: 1.5,
  //   w: 8.5,
  //   h: 4.5,
  //   fill: { color: 'F8FAFC' },
  //   line: { color: colors.primary, pt: 2 },
  // });

  // slide3.addText('Financial Chart\n(Chart data will be displayed here)', {
  //   x: 0.7,
  //   y: 3.5,
  //   w: 8.5,
  //   h: 1,
  //   fontSize: 16,
  //   color: colors.textDark,
  //   align: 'center',
  //   valign: 'middle',
  // });
  // addSlideNumber(slide3);

  // // Slide 4: Product Roadmap (Fixed Table)
  // const slide4 = pptx.addSlide({ masterName: 'CONTENT_MASTER_CORPORATE' });
  // slide4.addText('Product Development Roadmap', { placeholder: 'slideTitle' });

  // const tableData = [
  //   [
  //     {
  //       text: 'Phase',
  //       options: {
  //         bold: true,
  //         fill: { color: colors.primary },
  //         color: colors.textLight,
  //       },
  //     },
  //     {
  //       text: 'Key Features',
  //       options: {
  //         bold: true,
  //         fill: { color: colors.primary },
  //         color: colors.textLight,
  //       },
  //     },
  //     {
  //       text: 'Target Date',
  //       options: {
  //         bold: true,
  //         fill: { color: colors.primary },
  //         color: colors.textLight,
  //       },
  //     },
  //     {
  //       text: 'Status',
  //       options: {
  //         bold: true,
  //         fill: { color: colors.primary },
  //         color: colors.textLight,
  //       },
  //     },
  //   ],
  //   [
  //     { text: 'Phase 1', options: {} },
  //     { text: 'User authentication, Basic Dashboard', options: {} },
  //     { text: 'Q3 2025', options: {} },
  //     { text: 'In Progress', options: {} },
  //   ],
  //   [
  //     { text: 'Phase 2', options: {} },
  //     { text: 'Advanced Reporting, Integrations', options: {} },
  //     { text: 'Q4 2025', options: {} },
  //     { text: 'Planned', options: {} },
  //   ],
  //   [
  //     { text: 'Phase 3', options: {} },
  //     { text: 'AI-powered Analytics, Custom Workflows', options: {} },
  //     { text: 'Q1 2026', options: {} },
  //     { text: 'Research', options: {} },
  //   ],
  // ];

  // slide4.addTable(tableData, {
  //   x: 0.5,
  //   y: 1.5,
  //   w: 9,
  //   h: 4,
  //   colW: [1.5, 4.5, 1.5, 1.5],
  //   border: { pt: 1, color: colors.accentShape },
  //   fontSize: 12,
  //   fontFace: font,
  //   align: 'left',
  //   valign: 'middle',
  // });
  // addSlideNumber(slide4);

  // // Slide 5: Client Testimonial (Fixed Quote)
  // const slide5 = pptx.addSlide({ masterName: 'CONTENT_MASTER_CORPORATE' });
  // slide5.addText('What Our Clients Say', { placeholder: 'slideTitle' });

  // slide5.addText('"', {
  //   x: 0.5,
  //   y: 1.5,
  //   w: 1,
  //   h: 1,
  //   fontSize: 80,
  //   color: colors.secondary,
  //   align: 'left',
  //   fontFace: 'Georgia',
  // });

  // slide5.addText(
  //   'Partnering with LearnPDF transformed our operations. Their expertise and dedication are truly unparalleled. We saw a significant increase in efficiency and ROI within months.',
  //   {
  //     x: 1.5,
  //     y: 2,
  //     w: 7,
  //     h: 2.5,
  //     fontSize: 24,
  //     italic: true,
  //     color: colors.textDark,
  //     fontFace: 'Georgia',
  //   },
  // );

  // slide5.addText('— Jane Doe, CEO of Innovate Corp.', {
  //   x: 1.5,
  //   y: 4.5,
  //   w: 7,
  //   h: 0.5,
  //   fontSize: 18,
  //   color: colors.primary,
  //   align: 'right',
  //   fontFace: font,
  // });
  // addSlideNumber(slide5);

  // // Slide 6: Next Steps
  // const slide6 = pptx.addSlide({ masterName: 'CONTENT_MASTER_CORPORATE' });
  // slide6.addText('Next Steps and Recommendations', {
  //   placeholder: 'slideTitle',
  // });
  // slide6.addText(
  //   [
  //     {
  //       text: '1. Strategic Workshop:',
  //       options: { bold: true, fontSize: 20, color: colors.primary },
  //     },
  //     {
  //       text: '\nSchedule a session to deep-dive into Q3 initiatives.',
  //       options: { fontSize: 18 },
  //     },
  //     {
  //       text: '\n\n2. Resource Allocation:',
  //       options: { bold: true, fontSize: 20, color: colors.primary },
  //     },
  //     {
  //       text: '\nReview and optimize team resources for upcoming projects.',
  //       options: { fontSize: 18 },
  //     },
  //     {
  //       text: '\n\n3. Performance Monitoring:',
  //       options: { bold: true, fontSize: 20, color: colors.primary },
  //     },
  //     {
  //       text: '\nImplement new dashboards for real-time tracking.',
  //       options: { fontSize: 18 },
  //     },
  //   ],
  //   { x: 0.5, y: 1.2, w: 9, h: 5.5, fontFace: font, color: colors.textDark },
  // );
  // addSlideNumber(slide6);

  // // Slide 7: Thank You
  // const slide7 = pptx.addSlide({ masterName: 'CONTENT_MASTER_CORPORATE' });
  // slide7.addText('Thank You!', {
  //   x: 0.5,
  //   y: 2.5,
  //   w: 9,
  //   h: 1,
  //   fontSize: 48,
  //   color: colors.primary,
  //   align: 'center',
  //   fontFace: font,
  //   bold: true,
  // });

  // slide7.addText(
  //   [
  //     {
  //       text: 'Contact Us:',
  //       options: { bold: true, fontSize: 24, color: colors.textDark },
  //     },
  //     { text: '\nEmail: info@learnpdf.ca', options: { fontSize: 18 } },
  //     { text: '\nWebsite: www.learnpdf.ca', options: { fontSize: 18 } },
  //     { text: '\nPhone: +1 (123) 456-7890', options: { fontSize: 18 } },
  //   ],
  //   { x: 2, y: 4, w: 6, h: 2, align: 'center', fontFace: font },
  // );
  // addSlideNumber(slide7);

  return pptx;
};
