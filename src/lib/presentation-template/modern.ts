export const getTitleSlide = (presentation: any, colorScheme: any) => {
  // Master 1: Title Slide (simplified - only shapes that work reliably in masters)
  presentation.defineSlideMaster({
    title: 'Modern Background',
    background: {color: colorScheme.background},
  });
  const slide = presentation.addSlide({ masterName: 'Modern Background' });

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
  slide.addText('BUSINESS\nPRESENTATION', {
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

  slide.addText('Present by: LearnPDF | Class: Business Class', {
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
  slide.addText('Presentation\nTitle', {
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
// const addSlideNumber = (slide: any, x = '90%', y = '95%', opts = {}) => {
//     slide.addText(`Slide ${slide.number || 1}`, {
//       x,
//       y,
//       w: '10%',
//       h: '5%',
//       fontSize: 10,
//       color: '888888',
//       align: 'right',
//       ...opts,
//     });
//   };
