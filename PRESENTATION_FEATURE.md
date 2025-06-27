# AI Presentation Generator Feature

## Overview
This feature allows users to generate PowerPoint presentations using AI. Users can input their presentation topic, customize the number of slides, tone, and visual style, then download a professionally formatted PowerPoint file.

## Implementation Details

### Backend (`src/app/api/presentation/POST.ts`)
- **Technology**: Next.js API Route with pptxgenjs
- **Functionality**: 
  - Accepts POST requests with presentation parameters
  - Generates PowerPoint files dynamically based on user input
  - Returns files as downloadable blobs with proper headers
  - Supports different visual styles and tones
  - Includes error handling and logging

### Frontend (`src/components/Projects/Presentation.tsx`)
- **Technology**: React with TypeScript, Tailwind CSS, Framer Motion
- **Features**:
  - Beautiful, responsive UI with animations
  - Form validation and error handling
  - Real-time slide count slider
  - Tone and style selection
  - Loading states and user feedback
  - Automatic file download

## API Endpoint

### POST `/api/presentation`
**Request Body:**
```typescript
{
  prompt: string;        // Presentation topic and content
  slideCount: number;    // Number of slides (1-50)
  tone: string;          // 'professional' | 'casual' | 'academic' | 'creative' | 'technical'
  style: string;         // 'modern' | 'minimal' | 'colorful' | 'elegant' | 'corporate'
}
```

**Response:**
- **Success**: PowerPoint file as blob with proper headers
- **Error**: JSON error message

## Features

### Visual Styles
- **Modern**: Purple/blue gradient theme
- **Minimal**: Gray/neutral theme
- **Colorful**: Pink/purple gradient theme
- **Elegant**: Green/emerald theme
- **Corporate**: Dark gray theme

### Tones
- **Professional**: Business-appropriate content
- **Casual**: Friendly, approachable content
- **Academic**: Educational, research-focused content
- **Creative**: Artistic, innovative content
- **Technical**: Detailed, technical content

### User Experience
- Real-time form validation
- Interactive slide count slider
- Visual feedback for selections
- Loading states during generation
- Error handling with user-friendly messages
- Automatic file download with timestamped filenames

## Technical Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, Axios
- **Backend**: Next.js API Routes, pptxgenjs
- **Styling**: Tailwind CSS with custom gradients and animations
- **State Management**: React useState hooks
- **Error Handling**: Try-catch blocks with user feedback

## File Structure
```
src/
├── app/
│   └── api/
│       └── presentation/
│           └── POST.ts              # Backend API endpoint
└── components/
    └── Projects/
        └── Presentation.tsx         # Frontend component
```

## Usage
1. Navigate to the Presentation component
2. Enter your presentation topic and requirements
3. Adjust slide count using the slider
4. Select appropriate tone and style
5. Click "Generate Presentation"
6. File will automatically download as a .pptx file

## Error Handling
- Form validation prevents empty submissions
- Network errors are caught and displayed to users
- Backend errors are logged and return appropriate HTTP status codes
- Loading states prevent multiple simultaneous requests 