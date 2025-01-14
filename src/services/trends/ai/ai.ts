export interface AIAnalysis {
  description: string;
  suggestedTags: string[];
  colorPalette: string[];
  metadata?: {
    dimensions?: string;
    aspectRatio?: number;
    brightness?: number;
  };
}

// Common colors for filtering
export const commonColors = [
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#008000', // Dark Green
  '#000000', // Black
  '#FFFFFF', // White
  '#808080', // Gray
];

// Mock function for AI image analysis
export const generateAIDescription = async (imageUrl: string) => {
  // TODO: Implement actual AI analysis
  return {
    description: "A beautiful image showcasing nature's wonders.",
    suggestedTags: ['nature', 'landscape', 'scenic'],
    colorPalette: commonColors.slice(0, 3),
  };
}; 