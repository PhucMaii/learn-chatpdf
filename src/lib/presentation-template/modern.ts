// Types and Interfaces for Dynamic Slide Content
interface TitleSlideContent {
  mainTitle: string;
  subtitle: string;
  presentedBy: string;
}

interface MapSlideContent {
  title: string;
  subtitle: string;
  steps: {
    number: string;
    title: string;
  }[];
}

interface ContentSlideHalfHalfContent {
  title: string;
  description: string;
  imagePlaceholder?: string;
}

interface ComparisonSlideContent {
  title: string;
  subtitle: string;
  leftLabel: string;
  leftImagePlaceholder: string;
  rightTitle: string;
  rightDescription: string;
}

interface ContentSlideWithImageGridContent {
  title: string;
  description: string;
  imagePlaceholder?: string;
}

interface MarketingStrategySlideContent {
  title: string;
  columns: {
    imagePlaceholder: string;
    title: string;
    description: string;
    tags: string[];
  }[];
}

interface ContentSlideWithCircleContent {
  title: string;
  listItems: string[];
}

interface DataAnalystSlideContent {
  leftTitle: string;
  checklistItems: string[];
  rightTitlePart1: string;
  rightTitlePart2: string;
  mainParagraph: string;
  bulletPoints: string[];
}

interface MarketingStatsSlideContent {
  title: string;
  tableHeaders: string[];
  tableRows: {
    name: string;
    campaign: string;
    clicks: string;
    conversion: string;
    roi: string;
  }[];
}

interface ThankYouSlideContent {
  mainTitle: string;
  subtitle: string;
  discussionText: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
}

export const getTitleSlide = (
  presentation: any,
  colorScheme: any,
  content: TitleSlideContent,
  masterName: string = '',
) => {
  // Slide 1
  const slide = presentation.addSlide({ masterName: masterName });

  // Add oval shapes directly to the slide (guaranteed to work)
  // Large oval partially visible in top-left (extends beyond slide)
  slide.addShape(presentation.shapes.OVAL, {
    x: -1.5,
    y: -1.5,
    w: 3,
    h: 3,
    fill: { color: colorScheme.primary },
  });

  // Large oval partially visible in bottom-right (extends beyond slide)
  slide.addShape(presentation.shapes.OVAL, {
    x: 5.5,
    y: 1.5,
    w: 6,
    h: 6,
    fill: { color: colorScheme.primary },
  });

  // Add background shape for the main title
  slide.addShape(presentation.shapes.ROUNDED_RECTANGLE, {
    x: 2,
    y: 1,
    w: 7,
    h: 3.5,
    fill: { color: colorScheme.background },
    shadow: {
      type: 'outer',
      offsetX: 0,
      offsetY: 0,
      blur: 10,
      strength: 0.5,
    },
    rectRadius: 0.5,
  });

  // Add main title text
  slide.addText(content.mainTitle, {
    x: 3.2,
    y: 1.5,
    w: 5,
    h: 2,
    breakLine: true,
    align: 'left',
    valign: 'middle',
    fontSize: 48,
    color: colorScheme.primary,
    bold: true,
    fit: 'shrink',
  });

  slide.addText(content.presentedBy, {
    x: 3.2,
    y: 3.5,
    w: 5,
    h: 0.5,
    align: 'left',
    valign: 'middle',
    fontSize: 12,
    color: colorScheme.textDark,
    fit: 'shrink',
  });

  // Add background shape for the subtitle - using OVAL shape
  slide.addShape(presentation.shapes.OVAL, {
    x: 1,
    y: 1.8,
    w: 2,
    h: 2,
    fill: { color: colorScheme.primary },
    shadow: {
      type: 'outer',
      offsetX: 0,
      offsetY: 0,
      blur: 10,
      strength: 0.5,
    },
  });

  // Add subtitle text
  slide.addText(content.subtitle, {
    x: 0.9,
    y: 1.8,
    w: 2,
    h: 2,
    breakLine: true,
    align: 'center',
    valign: 'middle',
    color: '#FFFFFF',
    fontSize: 24,
    bold: true,
    margin: 10,
    fit: 'shrink',
  });

  return slide;
};

export const getMapSlide = (
  presentation: any,
  colorScheme: any,
  content: MapSlideContent,
  masterName: string = '',
  selectedStep: number = 1,
) => {
  const slide = presentation.addSlide({ masterName: masterName });

  // Small Oval
  slide.addShape(presentation.shapes.OVAL, {
    x: -1.5,
    y: 4,
    w: 3,
    h: 3,
    fill: { color: colorScheme.primary },
  });

  // Large oval
  slide.addShape(presentation.shapes.OVAL, {
    x: 5.5,
    y: -3,
    w: 7,
    h: 7,
    fill: { color: colorScheme.primary },
  });

  slide.addText(content.title, {
    x: 0.2,
    y: 1,
    w: 4.4,
    h: 1.9,
    align: 'left',
    valign: 'middle',
    fontSize: 48,
    color: colorScheme.primary,
    bold: true,
    fit: 'shrink',
  });

  slide.addText(content.subtitle, {
    x: 0.2,
    y: 2.8,
    w: 4.4,
    h: 0.5,
    align: 'left',
    valign: 'middle',
    fontSize: 12,
    color: colorScheme.textDark,
    fit: 'shrink',
  });

  // Render steps dynamically
  content.steps.forEach((step, index) => {
    const stepNumber = index + 1;
    const stepSelected = selectedStep === stepNumber;

    slide.addShape(presentation.shapes.ROUNDED_RECTANGLE, {
      x: stepSelected ? 4.5 : 5.4,
      y: 0.4 + index * 1.2,
      w: 3.8,
      h: 1,
      fill: { color: stepSelected ? colorScheme.primary : colorScheme.white },
      shadow: {
        type: 'outer',
        offsetX: 0,
        offsetY: 0,
        blur: 10,
        strength: 0.5,
      },
      rectRadius: 0.1,
    });

    slide.addText(step.number, {
      x: stepSelected ? 4.6 : 5.5,
      y: 0.7 + index * 1.2,
      w: 0.7,
      h: 0.3,
      align: 'center',
      valign: 'middle',
      fontSize: 18,
      color: stepSelected ? colorScheme.white : colorScheme.textDark,
      bold: true,
      fit: 'shrink',
    });

    slide.addShape(presentation.shapes.LINE, {
      x: stepSelected ? 5.4 : 6.3,
      y: 0.4 + index * 1.2,
      h: 1,
      w: 0,
      line: {
        color: stepSelected ? colorScheme.white : colorScheme.textDark,
        width: 1,
      },
    });

    slide.addText(step.title, {
      x: stepSelected ? 5.5 : 6.4,
      y: 0.7 + index * 1.2,
      w: 3.8,
      h: 0.3,
      align: 'left',
      valign: 'middle',
      fontSize: 18,
      color: stepSelected ? colorScheme.white : colorScheme.textDark,
      fit: 'shrink',
    });
  });

  return slide;
};

export const getContentSlideStyleHalfHalf = (
  presentation: any,
  colorScheme: any,
  content: ContentSlideHalfHalfContent,
  masterName: string = '',
) => {
  const slide = presentation.addSlide({ masterName: masterName });

  // Title
  slide.addText(content.title, {
    x: 0.2,
    y: 1,
    w: 5.5,
    h: 2,
    wrap: true,
    align: 'left',
    valign: 'middle',
    fontSize: 48,
    color: colorScheme.primary,
    bold: true,
    fit: 'shrink',
  });

  slide.addText(content.description, {
    x: 0.2,
    y: 3,
    w: 5.5,
    h: 2,
    wrap: true,
    align: 'left',
    valign: 'top',
    fontSize: 12,
    color: colorScheme.textDark,
    fit: 'shrink',
  });

  // Image placeholder
  slide.addShape(presentation.shapes.ROUNDED_RECTANGLE, {
    x: 5.4,
    y: 0.5,
    w: 4,
    h: 4,
    fill: { color: colorScheme.white },
    line: { color: colorScheme.primary, dashType: 'dash' },
    rectRadius: 0.5,
  });

  slide.addText(content.imagePlaceholder || 'Image', {
    x: 5.4,
    y: 0.5,
    w: 4,
    h: 4,
    align: 'center',
    valign: 'middle',
    fontSize: 18,
    color: colorScheme.textDark,
    fit: 'shrink',
  });
};

export const getComparisonSlide = (
  presentation: any,
  colorScheme: any,
  content: ComparisonSlideContent,
  masterName: string = '',
) => {
  const slide = presentation.addSlide({ masterName: masterName });

  // Title
  slide.addText(content.title, {
    x: 0,
    y: 0.3,
    w: 10,
    h: 0.7,
    align: 'center',
    valign: 'middle',
    fontSize: 48,
    color: colorScheme.textDark,
    bold: true,
    fit: 'shrink',
  });

  slide.addText(content.subtitle, {
    x: 0,
    y: 1,
    w: 10,
    h: 0.7,
    align: 'center',
    valign: 'middle',
    fontSize: 48,
    color: colorScheme.primary,
    bold: true,
    fit: 'shrink',
  });

  slide.addText(content.leftLabel, {
    x: 1.8,
    y: 1.6,
    w: 6.4,
    h: 0.7,
    align: 'center',
    valign: 'middle',
    fontSize: 18,
    color: colorScheme.textDark,
    bold: true,
    fit: 'shrink',
  });

  slide.addShape(presentation.shapes.RECTANGLE, {
    x: 0.5,
    y: 2.3,
    w: 4.5,
    h: 2.4,
    fill: { color: colorScheme.white },
    line: { color: colorScheme.primary, dashType: 'dash' },
  });

  slide.addText(content.leftImagePlaceholder, {
    x: 0.5,
    y: 2.3,
    w: 4.5,
    h: 2.4,
    align: 'center',
    valign: 'middle',
    fontSize: 18,
    color: colorScheme.textDark,
    fit: 'shrink',
  });

  slide.addShape(presentation.shapes.RECTANGLE, {
    x: 5,
    y: 2.3,
    w: 4.5,
    h: 2.4,
    fill: { color: colorScheme.primary },
  });

  slide.addText(content.rightTitle, {
    x: 5.2,
    y: 2.4,
    w: 4.1,
    h: 0.4,
    align: 'left',
    valign: 'middle',
    fontSize: 14,
    color: colorScheme.white,
    bold: true,
    fit: 'shrink',
  });

  slide.addText(content.rightDescription, {
    x: 5.2,
    y: 2.8,
    w: 4.1,
    h: 2.4,
    align: 'left',
    valign: 'middle',
    fontSize: 10.5,
    color: colorScheme.white,
    fit: 'shrink',
  });
};

export const getContentSlideWithImageGrid = (
  presentation: any,
  colorScheme: any,
  content: ContentSlideWithImageGridContent,
  masterName: string = '',
) => {
  const slide = presentation.addSlide({ masterName: masterName });

  // Large oval in top-left (partially visible)
  slide.addShape(presentation.shapes.OVAL, {
    x: -2,
    y: -1.5,
    w: 5,
    h: 5,
    fill: { color: colorScheme.primary },
  });

  // Small oval in bottom-right (partially visible)
  slide.addShape(presentation.shapes.OVAL, {
    x: 7,
    y: 3,
    w: 3.5,
    h: 3.5,
    fill: { color: colorScheme.primary },
  });

  // Image placeholders - 2x2 grid
  const imageWidth = 1.6;
  const imageHeight = 1.2;
  const gridSpacing = 0.2;
  const gridStartX = 0.3;
  const gridStartY = 0.6;

  // Create 4 image placeholders
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      slide.addShape(presentation.shapes.ROUNDED_RECTANGLE, {
        x: gridStartX + col * (imageWidth + gridSpacing),
        y: gridStartY + row * (imageHeight + gridSpacing),
        w: imageWidth,
        h: imageHeight,
        fill: { color: colorScheme.white },
        line: { color: colorScheme.primary, width: 2 },
        rectRadius: 0.2,
      });

      slide.addText(content.imagePlaceholder || 'Image Here', {
        x: gridStartX + col * (imageWidth + gridSpacing),
        y: gridStartY + row * (imageHeight + gridSpacing),
        w: imageWidth,
        h: imageHeight,
        align: 'center',
        valign: 'middle',
        fontSize: 14,
        color: colorScheme.textDark,
        fit: 'shrink',
      });
    }
  }

  // Main title on the right
  slide.addText(content.title, {
    x: 4.8,
    y: 1,
    w: 4.5,
    h: 1.5,
    align: 'left',
    valign: 'middle',
    fontSize: 42,
    color: colorScheme.primary,
    bold: true,
    fit: 'shrink',
  });

  // Content text
  slide.addText(content.description, {
    x: 4.8,
    y: 2.8,
    w: 4.5,
    h: 1.5,
    align: 'left',
    valign: 'top',
    fontSize: 14,
    color: colorScheme.textDark,
    wrap: true,
    fit: 'shrink',
  });

  return slide;
};

export const getMarketingStrategySlide = (
  presentation: any,
  colorScheme: any,
  content: MarketingStrategySlideContent,
  masterName: string = '',
) => {
  const slide = presentation.addSlide({ masterName: masterName });

  // Main title
  slide.addText(content.title, {
    x: 2.5,
    y: 0.5,
    w: 5,
    h: 1.2,
    align: 'center',
    valign: 'middle',
    fontSize: 48,
    color: colorScheme.textDark,
    bold: true,
    fit: 'shrink',
  });

  // Column specifications
  const columnWidth = 2.8;
  const columnSpacing = 0.4;
  const startX = 0.5;
  const imageHeight = 1.8;
  const imageY = 1.8;

  content.columns.forEach((column, index) => {
    const colX = startX + index * (columnWidth + columnSpacing);

    // Column image
    slide.addShape(presentation.shapes.ROUNDED_RECTANGLE, {
      x: colX,
      y: imageY,
      w: columnWidth,
      h: imageHeight,
      fill: { color: colorScheme.white },
      line: { color: colorScheme.textLight, width: 1 },
      rectRadius: 0.1,
    });

    slide.addText(column.imagePlaceholder, {
      x: colX,
      y: imageY,
      w: columnWidth,
      h: imageHeight,
      align: 'center',
      valign: 'middle',
      fontSize: 16,
      color: colorScheme.textDark,
      fit: 'shrink',
    });

    // Column title
    slide.addText(column.title, {
      x: colX,
      y: imageY + imageHeight + 0.2,
      w: columnWidth,
      h: 0.4,
      align: 'center',
      valign: 'middle',
      fontSize: 18,
      color: colorScheme.primary,
      bold: true,
      fit: 'shrink',
    });

    // Column description
    slide.addText(column.description, {
      x: colX,
      y: imageY + imageHeight + 0.6,
      w: columnWidth,
      h: 0.8,
      align: 'center',
      valign: 'top',
      fontSize: 12,
      color: colorScheme.textDark,
      wrap: true,
      fit: 'shrink',
    });

    // Tags
    const tagWidth = 0.8;
    const tagHeight = 0.25;
    const tagSpacing = 0.1;
    const tagsStartY = imageY + imageHeight + 1.5;

    column.tags.forEach((tag, tagIndex) => {
      if (tagIndex < 3) {
        // Limit to 3 tags per column
        slide.addShape(presentation.shapes.ROUNDED_RECTANGLE, {
          x: colX + tagIndex * (tagWidth + tagSpacing),
          y: tagsStartY,
          w: tagWidth,
          h: tagHeight,
          fill: { color: colorScheme.white },
          line: { color: colorScheme.primary, width: 1 },
          rectRadius: 0.15,
        });

        slide.addText(tag, {
          x: colX + tagIndex * (tagWidth + tagSpacing),
          y: tagsStartY,
          w: tagWidth,
          h: tagHeight,
          align: 'center',
          valign: 'middle',
          fontSize: 10,
          color: colorScheme.primary,
          fit: 'shrink',
        });
      }
    });
  });

  return slide;
};

export const getContentSlideWithCircle = (
  presentation: any,
  colorScheme: any,
  content: ContentSlideWithCircleContent,
  masterName: string = '',
) => {
  const slide = presentation.addSlide({ masterName: masterName });

  // Large blue circle on the left
  slide.addShape(presentation.shapes.OVAL, {
    x: -1.5,
    y: -0.5,
    w: 6,
    h: 6,
    fill: { color: colorScheme.primary },
  });

  // Small blue circle in bottom right
  slide.addShape(presentation.shapes.OVAL, {
    x: 8,
    y: 3.5,
    w: 2.5,
    h: 2.5,
    fill: { color: colorScheme.primary },
  });

  // Title text inside the large circle
  slide.addText(content.title, {
    x: 0.5,
    y: 1.5,
    w: 4,
    h: 2,
    align: 'left',
    valign: 'middle',
    fontSize: 36,
    color: colorScheme.white,
    bold: true,
    fit: 'shrink',
  });

  // Content list on the right side
  const listStartX = 5.2;
  const listStartY = 1.2;
  const itemHeight = 0.8;
  const itemSpacing = 0.1;

  content.listItems.forEach((item, index) => {
    // Number
    slide.addText(`${index + 1}.`, {
      x: listStartX,
      y: listStartY + index * (itemHeight + itemSpacing),
      w: 0.5,
      h: itemHeight,
      align: 'left',
      valign: 'top',
      fontSize: 16,
      color: colorScheme.textDark,
      bold: true,
      fit: 'shrink',
    });

    // Content text
    slide.addText(item, {
      x: listStartX + 0.4,
      y: listStartY + index * (itemHeight + itemSpacing),
      w: 4,
      h: itemHeight,
      align: 'left',
      valign: 'top',
      fontSize: 16,
      color: colorScheme.textDark,
      wrap: true,
      fit: 'shrink',
    });
  });

  return slide;
};

export const getDataAnalystSlide = (
  presentation: any,
  colorScheme: any,
  content: DataAnalystSlideContent,
  masterName: string = '',
) => {
  const slide = presentation.addSlide({ masterName: masterName });

  // Large blue circle in bottom-left (extends beyond slide)
  slide.addShape(presentation.shapes.OVAL, {
    x: -3,
    y: 1.5,
    w: 8,
    h: 8,
    fill: { color: colorScheme.primary },
  });

  // Small blue circle in top-right (extends beyond slide)
  slide.addShape(presentation.shapes.OVAL, {
    x: 8.5,
    y: -3,
    w: 4,
    h: 4,
    fill: { color: colorScheme.primary },
  });

  // White rounded rectangle container for the left content
  slide.addShape(presentation.shapes.ROUNDED_RECTANGLE, {
    x: 0.3,
    y: 0.8,
    w: 4.5,
    h: 3.5,
    fill: { color: colorScheme.white },
    shadow: {
      type: 'outer',
      offsetX: 0,
      offsetY: 4,
      blur: 12,
      strength: 0.15,
    },
    rectRadius: 0.3,
  });

  // Title inside the white box
  slide.addText(content.leftTitle, {
    x: 0.6,
    y: 1.1,
    w: 4,
    h: 1,
    align: 'left',
    valign: 'middle',
    fontSize: 36,
    color: colorScheme.primary,
    bold: true,
    fit: 'shrink',
  });

  // Checklist items in the white box
  const checkStartX = 0.6;
  const checkStartY = 2.3;
  const checkItemHeight = 0.4;
  const checkSpacing = 0.1;
  const checkMarkOdd = 0.04;

  content.checklistItems.forEach((item, index) => {
    // Green checkmark circle
    slide.addShape(presentation.shapes.OVAL, {
      x: checkStartX,
      y: checkStartY + index * (checkItemHeight + checkSpacing),
      w: 0.25,
      h: 0.25,
      fill: { color: '#22C55E' }, // Green color
    });

    // White checkmark symbol
    slide.addText('✓', {
      x: checkStartX - checkMarkOdd,
      y: checkStartY + index * (checkItemHeight + checkSpacing),
      w: 0.25,
      h: 0.25,
      align: 'center',
      valign: 'middle',
      fontSize: 12,
      color: colorScheme.white,
      bold: true,
      fit: 'shrink',
    });

    // Checklist item text
    slide.addText(item, {
      x: checkStartX + 0.4,
      y: checkStartY + index * (checkItemHeight + checkSpacing),
      w: 3.5,
      h: checkItemHeight,
      align: 'left',
      valign: 'top',
      fontSize: 14,
      color: colorScheme.textDark,
      fit: 'shrink',
    });
  });

  // Right side title
  slide.addText(content.rightTitlePart1, {
    x: 5.5,
    y: 0.8,
    w: 4,
    h: 0.6,
    align: 'left',
    valign: 'middle',
    fontSize: 48,
    color: colorScheme.textDark,
    bold: true,
    fit: 'shrink',
  });

  slide.addText(content.rightTitlePart2, {
    x: 5.5,
    y: 1.4,
    w: 4.5,
    h: 0.6,
    align: 'left',
    valign: 'middle',
    fontSize: 48,
    color: colorScheme.primary,
    bold: true,
    fit: 'shrink',
  });

  // Main paragraph
  slide.addText(content.mainParagraph, {
    x: 5.5,
    y: 2.2,
    w: 4.5,
    h: 1.2,
    align: 'left',
    valign: 'top',
    fontSize: 12,
    color: colorScheme.textDark,
    wrap: true,
    fit: 'shrink',
  });

  // Bullet points
  const bulletStartX = 5.5;
  const bulletStartY = 3.6;
  const bulletItemHeight = 0.3;
  const bulletSpacing = 0.05;

  content.bulletPoints.forEach((item, index) => {
    // Bullet point
    slide.addText('•', {
      x: bulletStartX,
      y: bulletStartY + index * (bulletItemHeight + bulletSpacing),
      w: 0.1,
      h: bulletItemHeight,
      align: 'left',
      valign: 'top',
      fontSize: 12,
      color: colorScheme.textDark,
      bold: true,
      fit: 'shrink',
    });

    // Bullet text
    slide.addText(item, {
      x: bulletStartX + 0.1,
      y: bulletStartY + index * (bulletItemHeight + bulletSpacing),
      w: 4.5,
      h: bulletItemHeight,
      align: 'left',
      valign: 'top',
      fontSize: 12,
      color: colorScheme.textDark,
      wrap: true,
      fit: 'shrink',
    });
  });

  return slide;
};

export const getMarketingStatsSlide = (
  presentation: any,
  colorScheme: any,
  content: MarketingStatsSlideContent,
  masterName: string = '',
) => {
  const slide = presentation.addSlide({ masterName: masterName });

  // Main title
  slide.addText(content.title, {
    x: 1,
    y: 0.5,
    w: 8,
    h: 0.8,
    align: 'center',
    valign: 'middle',
    fontSize: 48,
    color: colorScheme.textDark,
    bold: true,
    fit: 'shrink',
  });

  // Build table data from content
  const tableData = [
    // Header row
    content.tableHeaders.map((header) => ({
      text: header,
      options: { bold: true, color: colorScheme.textDark, fontSize: 16 },
    })),
    // Data rows
    ...content.tableRows.map((row) => [
      {
        text: row.name,
        options: { color: colorScheme.textDark, fontSize: 14 },
      },
      {
        text: row.campaign,
        options: { color: colorScheme.textDark, fontSize: 14 },
      },
      {
        text: row.clicks,
        options: { color: colorScheme.textDark, fontSize: 14 },
      },
      {
        text: row.conversion,
        options: { color: colorScheme.textDark, fontSize: 14 },
      },
      {
        text: row.roi,
        options: { color: colorScheme.primary, fontSize: 14, bold: true },
      },
    ]),
  ];

  // Add the table
  slide.addTable(tableData, {
    x: 0.8,
    y: 1.8,
    w: 8.4,
    h: 3,
    colW: [1.68, 1.68, 1.68, 1.68, 1.68], // Equal column widths
    border: {
      pt: 1,
      color: colorScheme.textLight,
    },
    fill: { color: colorScheme.white },
    margin: 0.1,
    rowH: [0.5, ...Array(content.tableRows.length).fill(0.4)], // Header row slightly taller
    valign: 'middle',
    align: 'center',
  });

  return slide;
};

export const getThankYouSlide = (
  presentation: any,
  colorScheme: any,
  content: ThankYouSlideContent,
  masterName: string = '',
) => {
  const slide = presentation.addSlide({ masterName: masterName });

  // Large decorative blue circle in top-left
  slide.addShape(presentation.shapes.OVAL, {
    x: -2,
    y: -2,
    w: 5,
    h: 5,
    fill: { color: colorScheme.primary },
  });

  // Medium blue circle in bottom-right
  slide.addShape(presentation.shapes.OVAL, {
    x: 7.5,
    y: 3,
    w: 4,
    h: 4,
    fill: { color: colorScheme.primary },
  });

  // Main "Thank You" text
  slide.addText(content.mainTitle, {
    x: 1,
    y: 1.5,
    w: 8,
    h: 1.5,
    align: 'center',
    valign: 'middle',
    fontSize: 64,
    color: colorScheme.textDark,
    bold: true,
    fit: 'shrink',
  });

  // Subtitle message
  slide.addText(content.subtitle, {
    x: 1,
    y: 3,
    w: 8,
    h: 0.6,
    align: 'center',
    valign: 'middle',
    fontSize: 24,
    color: colorScheme.primary,
    bold: true,
    fit: 'shrink',
  });

  // Contact information section
  slide.addText(content.discussionText, {
    x: 1,
    y: 4,
    w: 8,
    h: 0.4,
    align: 'center',
    valign: 'middle',
    fontSize: 18,
    color: colorScheme.textDark,
    bold: true,
    fit: 'shrink',
  });

  // Contact details
  slide.addText(
    `Email: ${content.contactInfo.email} | Phone: ${content.contactInfo.phone}`,
    {
      x: 1,
      y: 4.5,
      w: 8,
      h: 0.3,
      align: 'center',
      valign: 'middle',
      fontSize: 14,
      color: colorScheme.textDark,
      fit: 'shrink',
    },
  );

  slide.addText(`Website: ${content.contactInfo.website}`, {
    x: 1,
    y: 4.8,
    w: 8,
    h: 0.3,
    align: 'center',
    valign: 'middle',
    fontSize: 14,
    color: colorScheme.primary,
    fit: 'shrink',
  });

  return slide;
};

// Prompt Generation for AI Content Creation
export const generateSlideContentPrompt = (
  userPrompt: string,
  slideCount: number,
  tone: string,
  style: string,
) => {
  const minimumSlides = 10;
  const availableContentSlides = [
    'ContentSlideHalfHalf',
    'ComparisonSlide',
    'ContentSlideWithImageGrid',
    'MarketingStrategySlide',
    'ContentSlideWithCircle',
    'DataAnalystSlide',
    'MarketingStatsSlide',
  ];

  const slideConfiguration = generateSlideConfiguration(
    slideCount,
    minimumSlides,
    availableContentSlides,
  );

  const contentPatterns = {
    TitleSlideContent: {
      mainTitle:
        '25-35 characters, can include \\n for line breaks, ALL CAPS for impact',
      subtitle: '15-25 characters, can include \\n, descriptive phrase',
      presentedBy:
        "50-80 characters, format: 'Presented by: [Name] | [Department/Role]'",
    },
    MapSlideContent: {
      title: '20-30 characters, can include \\n, describes process/steps',
      subtitle: '40-60 characters, explanatory tagline',
      steps:
        'Array of 3-5 objects, each with number (01, 02, etc.) and title (25-40 chars)',
    },
    ContentSlideHalfHalfContent: {
      title: '25-35 characters, numbered sections work well (1. TITLE FORMAT)',
      description: '180-250 characters, detailed explanation paragraph',
      imagePlaceholder: '15-25 characters, describes image content',
    },
    ComparisonSlideContent: {
      title: '15-25 characters, comparison topic',
      subtitle: "20-30 characters, 'A VS B' format works well",
      leftLabel: '15-25 characters, first comparison item',
      leftImagePlaceholder: '20-30 characters, describes left image',
      rightTitle: '25-40 characters, advantage/benefit title',
      rightDescription: '250-350 characters, detailed explanation of benefits',
    },
    ContentSlideWithImageGridContent: {
      title: '25-35 characters, can include \\n, section title',
      description: '200-280 characters, methodology or process explanation',
      imagePlaceholder: '10-20 characters, repeated for 4 grid images',
    },
    MarketingStrategySlideContent: {
      title: '15-25 characters, can include \\n for emphasis',
      columns:
        'Array of 3 objects, each with imagePlaceholder (15-25 chars), title (15-25 chars), description (120-160 chars), tags (array of 3 short words)',
    },
    ContentSlideWithCircleContent: {
      title: '25-35 characters, can include \\n, process step title',
      listItems:
        'Array of 4 items, each 80-120 characters, actionable steps or points',
    },
    DataAnalystSlideContent: {
      leftTitle: '10-15 characters, can include \\n, role/service title',
      checklistItems:
        'Array of 4 items, each 25-40 characters, capabilities or features',
      rightTitlePart1: '8-15 characters, first part of title',
      rightTitlePart2: '8-15 characters, second part of title',
      mainParagraph: '300-400 characters, detailed service description',
      bulletPoints:
        'Array of 4 items, each 60-80 characters, specific benefits or features',
    },
    MarketingStatsSlideContent: {
      title: '15-25 characters, performance/metrics title',
      tableHeaders: 'Array of 5 strings, each 8-15 characters, column headers',
      tableRows:
        'Array of 5 objects with name (15-20 chars), campaign (15-25 chars), clicks (4-6 chars), conversion (3-5 chars), roi (3-5 chars)',
    },
    ThankYouSlideContent: {
      mainTitle: "8-15 characters, usually 'THANK YOU'",
      subtitle: '15-25 characters, appreciation message',
      discussionText: '15-25 characters, call to action',
      contactInfo: 'email, phone, website - realistic contact information',
    },
  };

  return `You are an expert presentation content generator. Create engaging, professional slide content based on the user's requirements.

**USER REQUEST:**
Topic: ${userPrompt}
Slide Count: ${slideCount}
Tone: ${tone}
Style: ${style}

**SLIDE CONFIGURATION:**
${JSON.stringify(slideConfiguration, null, 2)}

**CONTENT REQUIREMENTS:**
Generate content that matches these character length patterns and maintains consistency with the ${tone} tone and ${style} style:

${Object.entries(contentPatterns)
  .map(
    ([slideType, patterns]) => `
**${slideType}:**
${Object.entries(patterns)
  .map(([field, requirement]) => `  ${field}: ${requirement}`)
  .join('\n')}
`,
  )
  .join('\n')}

**IMPORTANT GUIDELINES:**
1. All content must be relevant to the user's topic: "${userPrompt}"
2. Maintain ${tone} tone throughout (professional, casual, formal, enthusiastic, etc.)
3. Follow ${style} style guidelines (corporate, creative, academic, sales, etc.)
4. Use realistic data for statistics and metrics
5. Ensure content flows logically from slide to slide
6. Make titles and headers impactful and engaging
7. Keep descriptions informative but concise within character limits
8. Use action-oriented language for bullet points and steps
9. Make comparisons relevant and meaningful
10. Ensure all placeholder text describes relevant imagery

**OUTPUT FORMAT:**
Return a valid JSON object with this exact structure:

\`\`\`json
{
  "titleContent": {
    "mainTitle": "string",
    "subtitle": "string", 
    "presentedBy": "string"
  },
  "mapContent": {
    "title": "string",
    "subtitle": "string",
    "steps": [
      {"number": "01", "title": "string"},
      {"number": "02", "title": "string"},
      {"number": "03", "title": "string"}
    ]
  },
  "slides": [
    {
      "type": "ContentSlideHalfHalfContent",
      "content": {
        "title": "string",
        "description": "string",
        "imagePlaceholder": "string"
      }
    }
    // ... additional slides based on configuration
  ],
  "thankYouContent": {
    "mainTitle": "string",
    "subtitle": "string", 
    "discussionText": "string",
    "contactInfo": {
      "email": "string",
      "phone": "string",
      "website": "string"
    }
  }
}
\`\`\`

Generate compelling, cohesive content that tells a complete story about "${userPrompt}" across all ${slideCount} slides.`;
};

const generateSlideConfiguration = (
  slideCount: number,
  minimumSlides: number,
  availableContentSlides: string[],
) => {
  if (slideCount <= minimumSlides) {
    return {
      totalSlides: slideCount,
      structure: 'Use all 7 content slide types once each',
      contentSlides: availableContentSlides,
    };
  }

  const extraSlides = slideCount - minimumSlides;
  const repeatedSlides = [];

  // Distribute extra slides across available types
  for (let i = 0; i < extraSlides; i++) {
    const slideType = availableContentSlides[i % availableContentSlides.length];
    repeatedSlides.push(slideType);
  }

  return {
    totalSlides: slideCount,
    structure: `Use all 7 content slide types once, then repeat: ${repeatedSlides.join(', ')}`,
    contentSlides: [...availableContentSlides, ...repeatedSlides],
  };
};

// Content Analysis Helper
export const analyzeContentPatterns = () => {
  return {
    averageCharacterLengths: {
      shortTitle: 20,
      mediumTitle: 30,
      longTitle: 40,
      shortDescription: 150,
      mediumDescription: 250,
      longDescription: 350,
      bulletPoint: 70,
      listItem: 100,
      tableCell: 15,
    },
    commonPatterns: {
      titles: 'Usually ALL CAPS or Title Case, often numbered',
      descriptions: 'Paragraph format, professional language, action-oriented',
      placeholders: 'Descriptive, relevant to content topic',
      steps: 'Sequential, actionable, clear outcomes',
      comparisons: 'Contrasting concepts, clear benefits',
      statistics: 'Realistic percentages and numbers, industry-relevant',
    },
  };
};

// Parse AI Response and Generate Slide Content Objects
export const parseAIResponseToSlideContent = (aiResponse: any) => {
  try {
    const parsedResponse =
      typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;

    const slideContentObjects = [];

    // Add title slide
    slideContentObjects.push({
      function: 'getTitleSlide',
      content: parsedResponse.titleContent,
    });

    // Add map slide
    slideContentObjects.push({
      function: 'getMapSlide',
      content: parsedResponse.mapContent,
      selectedStep: 1,
    });

    // Add content slides
    parsedResponse.slides.forEach((slide: any) => {
      const slideObj: any = {
        content: slide.content,
      };

      switch (slide.type) {
        case 'ContentSlideHalfHalfContent':
          slideObj.function = 'getContentSlideStyleHalfHalf';
          break;
        case 'ComparisonSlideContent':
          slideObj.function = 'getComparisonSlide';
          break;
        case 'ContentSlideWithImageGridContent':
          slideObj.function = 'getContentSlideWithImageGrid';
          break;
        case 'MarketingStrategySlideContent':
          slideObj.function = 'getMarketingStrategySlide';
          break;
        case 'ContentSlideWithCircleContent':
          slideObj.function = 'getContentSlideWithCircle';
          break;
        case 'DataAnalystSlideContent':
          slideObj.function = 'getDataAnalystSlide';
          break;
        case 'MarketingStatsSlideContent':
          slideObj.function = 'getMarketingStatsSlide';
          break;
        default:
          console.warn(`Unknown slide type: ${slide.type}`);
          return;
      }

      slideContentObjects.push(slideObj);
    });

    // Add second map slide with step 2 highlighted
    slideContentObjects.push({
      function: 'getMapSlide',
      content: parsedResponse.mapContent,
      selectedStep: 2,
    });

    // Add thank you slide
    slideContentObjects.push({
      function: 'getThankYouSlide',
      content: parsedResponse.thankYouContent,
    });

    return slideContentObjects;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error(
      'Failed to parse AI response. Please ensure it follows the required JSON format.',
    );
  }
};

// Type for slide generation functions
type SlideFunction = (
  presentation: any,
  colorScheme: any,
  content: any,
  masterName?: string,
  selectedStep?: number,
) => any;

// Generate Dynamic Presentation Function
export const generateDynamicPresentation = (
  presentation: any,
  colorScheme: any,
  slideContentObjects: any[],
  masterName: string = '',
) => {
  const functionMap: { [key: string]: SlideFunction } = {
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
  };

  slideContentObjects.forEach((slideObj, index) => {
    const slideFunction = functionMap[slideObj.function];

    if (!slideFunction) {
      console.warn(`Function ${slideObj.function} not found`);
      return;
    }

    try {
      if (slideObj.function === 'getMapSlide') {
        slideFunction(
          presentation,
          colorScheme,
          slideObj.content,
          masterName,
          slideObj.selectedStep || 1,
        );
      } else {
        slideFunction(presentation, colorScheme, slideObj.content, masterName);
      }
    } catch (error) {
      console.error(
        `Error generating slide ${index + 1} (${slideObj.function}):`,
        error,
      );
    }
  });

  return presentation;
};

/**
 * USAGE EXAMPLE:
 *
 * // 1. Generate prompt for AI
 * const prompt = generateSlideContentPrompt(
 *   "Building a SaaS startup from idea to IPO",
 *   12,
 *   "professional",
 *   "corporate"
 * );
 *
 * // 2. Send prompt to AI (OpenAI, Claude, etc.)
 * const aiResponse = await openai.chat.completions.create({
 *   messages: [{ role: "user", content: prompt }],
 *   model: "gpt-4"
 * });
 *
 * // 3. Parse AI response
 * const slideObjects = parseAIResponseToSlideContent(aiResponse.choices[0].message.content);
 *
 * // 4. Generate presentation
 * const pptx = new pptxgen();
 * const colors = { primary: '#0065ff', ... };
 * generateDynamicPresentation(pptx, colors, slideObjects);
 *
 * // 5. Save presentation
 * pptx.writeFile("dynamic-presentation.pptx");
 */

// Export all interfaces for external use
export type {
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
};
