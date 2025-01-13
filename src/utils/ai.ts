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

export async function generateAIDescription(imageUrl: string): Promise<AIAnalysis> {
  // Temporary mock implementation until we integrate with OpenAI
  return {
    description: "A beautiful image with vibrant colors",
    suggestedTags: ["landscape", "nature", "colorful"],
    colorPalette: ["#4A90E2", "#50E3C2", "#F5A623"],
    metadata: {
      dimensions: "1920x1080",
      aspectRatio: 1.778,
      brightness: 0.7
    }
  };
}

export const commonColors = [
  "#4A90E2", // Blue
  "#50E3C2", // Turquoise
  "#F5A623", // Orange
  "#D0021B", // Red
  "#7ED321", // Green
]; 