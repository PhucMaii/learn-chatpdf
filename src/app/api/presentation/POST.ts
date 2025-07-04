import {
  getTitleSlide,
  getMapSlide,
  getContentSlideStyleHalfHalf,
  getComparisonSlide,
  getContentSlideWithImageGrid,
  getMarketingStrategySlide,
  getContentSlideWithCircle,
  getDataAnalystSlide,
  getMarketingStatsSlide,
  getThankYouSlide,
  generateSlideContentPrompt,
  parseAIResponseToSlideContent,
  generateDynamicPresentation,
} from '@/lib/presentation-template/modern';

import type {
  TitleSlideContent,
  MapSlideContent,
  ContentSlideHalfHalfContent,
  ComparisonSlideContent,
  ContentSlideWithImageGridContent,
  MarketingStrategySlideContent,
  ContentSlideWithCircleContent,
  DataAnalystSlideContent,
  MarketingStatsSlideContent,
  ThankYouSlideContent,
} from '@/lib/presentation-template/modern';
import { NextRequest, NextResponse } from 'next/server';
import pptxgen from 'pptxgenjs';

interface PresentationRequest {
  prompt: string;
  slideCount: number;
  tone: string;
  style: string;
  projectId: number;
}

const handler = async (request: NextRequest) => {
  try {
    const body: PresentationRequest = await request.json();
    const { prompt, slideCount, tone, style } = body;

    console.log('Generating presentation with AI...', {
      prompt,
      slideCount,
      tone,
      style,
    });

    // Generate AI prompt for slide content
    const aiPrompt = generateSlideContentPrompt(
      prompt,
      slideCount,
      tone,
      style,
    );

    let slideContentObjects;

    try {
      // Try to generate content with AI
      const openaiResponse = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'user',
                content: aiPrompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 4000,
          }),
        },
      );

      if (!openaiResponse.ok) {
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      console.log('OpenAI Response received:', openaiData);

      const aiContent = openaiData.choices[0]?.message?.content;

      if (!aiContent) {
        throw new Error('No content received from OpenAI');
      }

      // Parse AI response to slide content objects
      slideContentObjects = parseAIResponseToSlideContent(aiContent);
      console.log(
        'Parsed slide objects:',
        slideContentObjects.length,
        'slides',
      );
    } catch (aiError) {
      console.log(
        'AI generation failed, falling back to static content:',
        aiError,
      );

      // Fallback to static content if AI fails
      slideContentObjects = generateFallbackContent(prompt, slideCount);
    }

    // Generate presentation with dynamic content
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    const colors = {
      primary: '#0065ff',
      secondary: '#e6e6e6',
      background: '#eff7ff',
      textDark: '#25282a',
      textLight: '#414244',
      accentShape: '#E0E0E0',
      white: '#ffffff',
    };

    generateDynamicPresentation(pptx, colors, slideContentObjects);

    const deckBuffer = (await pptx.write({
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
  } catch (error: any) {
    console.log('Something went wrong while generating presentation:', error);

    // Generate fallback presentation if everything fails
    try {
      const deck = generateCorporateDeck();
      const deckBuffer = (await deck.write({
        outputType: 'nodebuffer',
      })) as Buffer;

      return new NextResponse(deckBuffer, {
        status: 200,
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'Content-Disposition': `attachment; filename="fallback-presentation-${Date.now()}.pptx"`,
          'Content-Length': deckBuffer.length.toString(),
        },
      });
    } catch (fallbackError) {
      console.log('Fallback presentation generation failed:', fallbackError);
      return NextResponse.json(
        { error: 'Failed to generate presentation. Please try again.' },
        { status: 500 },
      );
    }
  }
};

// Generate fallback content when AI is unavailable
const generateFallbackContent = (userPrompt: string, slideCount: number) => {
  console.log('Generating fallback content for:', userPrompt);

  const fallbackSlides = [];

  // Title slide
  fallbackSlides.push({
    function: 'getTitleSlide',
    content: {
      mainTitle: userPrompt.toUpperCase().substring(0, 30) + '\nPRESENTATION',
      subtitle: 'Overview\n& Strategy',
      presentedBy: 'Presented by: LearnPDF | Generated Content',
    },
  });

  // Map slide
  fallbackSlides.push({
    function: 'getMapSlide',
    content: {
      title: '3 STEPS\nAPPROACH',
      subtitle: 'Strategic implementation framework',
      steps: [
        { number: '01', title: 'Research & Planning' },
        { number: '02', title: 'Implementation & Execution' },
        { number: '03', title: 'Optimization & Growth' },
      ],
    },
    selectedStep: 1,
  });

  // Generate content slides based on slideCount
  const contentSlideTypes = [
    'getContentSlideStyleHalfHalf',
    'getComparisonSlide',
    'getContentSlideWithImageGrid',
    'getMarketingStrategySlide',
    'getContentSlideWithCircle',
    'getDataAnalystSlide',
    'getMarketingStatsSlide',
  ];

  const maxContentSlides = slideCount - 4; // Exclude title, 2 map slides, and thank you

  for (let i = 0; i < maxContentSlides; i++) {
    const slideType = contentSlideTypes[i % contentSlideTypes.length];
    fallbackSlides.push(
      generateFallbackSlideContent(slideType, userPrompt, i + 1),
    );
  }

  // Second map slide
  fallbackSlides.push({
    function: 'getMapSlide',
    content: {
      title: '3 STEPS\nAPPROACH',
      subtitle: 'Strategic implementation framework',
      steps: [
        { number: '01', title: 'Research & Planning' },
        { number: '02', title: 'Implementation & Execution' },
        { number: '03', title: 'Optimization & Growth' },
      ],
    },
    selectedStep: 2,
  });

  // Thank you slide
  fallbackSlides.push({
    function: 'getThankYouSlide',
    content: {
      mainTitle: 'THANK YOU',
      subtitle: 'FOR YOUR ATTENTION',
      discussionText: 'Questions & Discussion',
      contactInfo: {
        email: 'contact@learnpdf.com',
        phone: '+1 (555) 123-4567',
        website: 'www.learnpdf.com',
      },
    },
  });

  return fallbackSlides;
};

const generateFallbackSlideContent = (
  slideType: string,
  topic: string,
  index: number,
) => {
  const baseContent = {
    title: `${index}. ${topic.toUpperCase()}`,
    description: `This section covers key aspects of ${topic} including strategic planning, implementation details, and expected outcomes for your organization.`,
  };

  switch (slideType) {
    case 'getContentSlideStyleHalfHalf':
      return {
        function: slideType,
        content: {
          ...baseContent,
          imagePlaceholder: 'Strategy Diagram',
        },
      };

    case 'getComparisonSlide':
      return {
        function: slideType,
        content: {
          title: 'COMPARISON',
          subtitle: 'BEFORE VS AFTER',
          leftLabel: 'Current State',
          leftImagePlaceholder: 'Current Process',
          rightTitle: 'IMPROVED APPROACH',
          rightDescription: `Enhanced ${topic} methodology delivering better results through strategic optimization and modern best practices.`,
        },
      };

    case 'getContentSlideWithImageGrid':
      return {
        function: slideType,
        content: {
          ...baseContent,
          imagePlaceholder: 'Process Step',
        },
      };

    case 'getMarketingStrategySlide':
      return {
        function: slideType,
        content: {
          title: 'STRATEGY\nOVERVIEW',
          columns: [
            {
              imagePlaceholder: 'PLANNING PHASE',
              title: 'Strategic Planning',
              description: `Comprehensive planning phase for ${topic} including analysis and goal setting.`,
              tags: ['Planning', 'Strategy', 'Goals'],
            },
            {
              imagePlaceholder: 'EXECUTION PHASE',
              title: 'Implementation',
              description: `Active implementation of ${topic} strategies with measurable milestones.`,
              tags: ['Execute', 'Deliver', 'Monitor'],
            },
            {
              imagePlaceholder: 'OPTIMIZATION',
              title: 'Optimization',
              description: `Continuous improvement and optimization of ${topic} processes.`,
              tags: ['Optimize', 'Improve', 'Scale'],
            },
          ],
        },
      };

    case 'getContentSlideWithCircle':
      return {
        function: slideType,
        content: {
          ...baseContent,
          listItems: [
            `Analyze current state and identify opportunities for ${topic} improvement.`,
            `Develop comprehensive strategy with clear objectives and success metrics.`,
            `Implement solution with proper change management and stakeholder alignment.`,
            `Monitor progress and optimize based on performance data and feedback.`,
          ],
        },
      };

    case 'getDataAnalystSlide':
      return {
        function: slideType,
        content: {
          leftTitle: 'ANALYTICS\nINSIGHTS',
          checklistItems: [
            'Data collection systems',
            'Performance monitoring',
            'Predictive analytics',
            'Reporting dashboards',
          ],
          rightTitlePart1: 'POWERFUL',
          rightTitlePart2: 'INSIGHTS',
          mainParagraph: `Advanced analytics capabilities for ${topic} provide actionable insights through data-driven decision making and performance optimization.`,
          bulletPoints: [
            'Real-time monitoring and automated alerts for key performance indicators.',
            'Predictive analytics to forecast trends and identify potential issues.',
            'Custom dashboard creation tailored to specific business requirements.',
            'Integration capabilities with existing systems for seamless data flow.',
          ],
        },
      };

    case 'getMarketingStatsSlide':
      return {
        function: slideType,
        content: {
          title: 'PERFORMANCE METRICS',
          tableHeaders: ['AREA', 'INITIATIVE', 'IMPACT', 'SUCCESS', 'ROI'],
          tableRows: [
            {
              name: 'Strategy A',
              campaign: 'Implementation',
              clicks: '85%',
              conversion: '12.5%',
              roi: '145%',
            },
            {
              name: 'Strategy B',
              campaign: 'Optimization',
              clicks: '92%',
              conversion: '15.2%',
              roi: '180%',
            },
            {
              name: 'Strategy C',
              campaign: 'Innovation',
              clicks: '78%',
              conversion: '9.8%',
              roi: '125%',
            },
          ],
        },
      };

    default:
      return {
        function: 'getContentSlideStyleHalfHalf',
        content: baseContent,
      };
  }
};

export default handler;

// Keep the original static generation function as backup
const generateCorporateDeck = () => {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  const colors = {
    primary: '#0065ff',
    secondary: '#e6e6e6',
    background: '#eff7ff',
    textDark: '#25282a',
    textLight: '#414244',
    accentShape: '#E0E0E0',
    white: '#ffffff',
  };

  // Define content for each slide
  const titleContent: TitleSlideContent = {
    mainTitle: 'BUSINESS\nPRESENTATION',
    subtitle: 'Company\nOverview',
    presentedBy: 'Presented by: LearnPDF | Department: Business Development',
  };

  const mapContent: MapSlideContent = {
    title: '3 STEPS\nPRESENTATION',
    subtitle: 'Each part is the solution of a problem',
    steps: [
      { number: '01', title: 'Market Research & Analysis' },
      { number: '02', title: 'Strategic Planning & Development' },
      { number: '03', title: 'Implementation & Growth' },
    ],
  };

  const contentHalfHalfContent: ContentSlideHalfHalfContent = {
    title: '1. HOW TO BUILD A BUSINESS',
    description:
      'Building a successful business requires careful planning, market understanding, and strategic execution. The point of using proven methodologies is that it has a more-or-less normal distribution of success, as opposed to using random approaches, making it look like sustainable growth.',
    imagePlaceholder: 'Business Strategy Diagram',
  };

  const comparisonContent: ComparisonSlideContent = {
    title: 'MARKET COMPARISON',
    subtitle: 'TRADITIONAL VS DIGITAL',
    leftLabel: 'Traditional Approach',
    leftImagePlaceholder: 'Traditional Business Model',
    rightTitle: 'DIGITAL TRANSFORMATION ADVANTAGE',
    rightDescription:
      "Digital transformation enables companies to leverage technology for competitive advantage. Modern businesses use data analytics, automation, and digital platforms to streamline operations, enhance customer experience, and accelerate growth in today's connected marketplace.",
  };

  const mapContent2: MapSlideContent = {
    title: '3 STEPS\nPRESENTATION',
    subtitle: 'Each part is the solution of a problem',
    steps: [
      { number: '01', title: 'Market Research & Analysis' },
      { number: '02', title: 'Strategic Planning & Development' },
      { number: '03', title: 'Implementation & Growth' },
    ],
  };

  const imageGridContent: ContentSlideWithImageGridContent = {
    title: '2. HOW TO BUILD\nA BUSINESS',
    description:
      "Visual representation of our business building methodology. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    imagePlaceholder: 'Process Step',
  };

  const marketingStrategyContent: MarketingStrategySlideContent = {
    title: 'MARKETING\nSTRATEGY',
    columns: [
      {
        imagePlaceholder: 'SOCIAL MEDIA CAMPAIGN',
        title: 'Digital Outreach',
        description:
          'Leverage social media platforms and digital advertising to reach target audiences with precision targeting and measurable results.',
        tags: ['Social', 'Digital', 'Analytics'],
      },
      {
        imagePlaceholder: 'CONTENT CREATION',
        title: 'Content Marketing',
        description:
          'Create valuable, relevant content that attracts and engages prospects while building brand authority and trust.',
        tags: ['Content', 'SEO', 'Branding'],
      },
      {
        imagePlaceholder: 'PARTNERSHIP NETWORK',
        title: 'Strategic Partnerships',
        description:
          'Build relationships with complementary businesses and industry leaders to expand reach and credibility.',
        tags: ['Partners', 'Network', 'Growth'],
      },
    ],
  };

  const circleContent: ContentSlideWithCircleContent = {
    title: '3. HOW TO BUILD\nA BUSINESS',
    listItems: [
      'Conduct thorough market research to identify opportunities and validate your business concept.',
      'Develop a comprehensive business plan with clear objectives, strategies, and financial projections.',
      'Secure adequate funding through investors, loans, or bootstrapping to support initial operations.',
      'Build a strong team with complementary skills and shared vision for long-term success.',
    ],
  };

  const dataAnalystContent: DataAnalystSlideContent = {
    leftTitle: 'DATA\nANALYST',
    checklistItems: [
      'Advanced analytics capabilities',
      'Real-time data processing',
      'Predictive modeling expertise',
      'Interactive dashboard creation',
    ],
    rightTitlePart1: 'POWERFUL',
    rightTitlePart2: 'INSIGHTS',
    mainParagraph:
      'Our data analytics platform transforms raw data into actionable insights. Using advanced machine learning algorithms and statistical analysis, we help businesses make informed decisions, identify trends, and optimize performance across all key metrics and operational areas.',
    bulletPoints: [
      'Real-time monitoring and automated alerts for critical metrics.',
      'Predictive analytics to forecast trends and prevent potential issues.',
      'Custom dashboard creation tailored to specific business needs.',
      'Integration with existing systems for seamless data flow and analysis.',
    ],
  };

  const marketingStatsContent: MarketingStatsSlideContent = {
    title: 'MARKETING PERFORMANCE',
    tableHeaders: ['CHANNEL', 'CAMPAIGN', 'LEADS', 'CONVERSION', 'ROI %'],
    tableRows: [
      {
        name: 'Social Media',
        campaign: 'Q4 Brand Campaign',
        clicks: '12,450',
        conversion: '8.5%',
        roi: '145%',
      },
      {
        name: 'Email Marketing',
        campaign: 'Newsletter Series',
        clicks: '8,920',
        conversion: '12.3%',
        roi: '230%',
      },
      {
        name: 'Google Ads',
        campaign: 'Search Campaign',
        clicks: '15,680',
        conversion: '6.7%',
        roi: '120%',
      },
      {
        name: 'Content Marketing',
        campaign: 'Blog & Resources',
        clicks: '6,340',
        conversion: '15.2%',
        roi: '180%',
      },
      {
        name: 'Partnerships',
        campaign: 'Referral Program',
        clicks: '9,100',
        conversion: '11.8%',
        roi: '165%',
      },
    ],
  };

  const thankYouContent: ThankYouSlideContent = {
    mainTitle: 'THANK YOU',
    subtitle: 'FOR YOUR ATTENTION',
    discussionText: 'Questions & Discussion',
    contactInfo: {
      email: 'contact@learnpdf.com',
      phone: '+1 (555) 123-4567',
      website: 'www.learnpdf.com',
    },
  };

  // Add slides with dynamic content
  getTitleSlide(pptx, colors, titleContent);
  getMapSlide(pptx, colors, mapContent, '', 1);
  getContentSlideStyleHalfHalf(pptx, colors, contentHalfHalfContent);
  getComparisonSlide(pptx, colors, comparisonContent);
  getMapSlide(pptx, colors, mapContent2, '', 2);
  getContentSlideWithImageGrid(pptx, colors, imageGridContent);
  getMarketingStrategySlide(pptx, colors, marketingStrategyContent);
  getContentSlideWithCircle(pptx, colors, circleContent);
  getDataAnalystSlide(pptx, colors, dataAnalystContent);
  getMarketingStatsSlide(pptx, colors, marketingStatsContent);
  getThankYouSlide(pptx, colors, thankYouContent);

  return pptx;
};
