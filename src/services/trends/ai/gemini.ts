import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const getGeminiClient = () => {
  // Use NEXT_PUBLIC prefix for client-side access
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

export interface ImageAnalysisResult {
  description: string;
  tags: string[];
  colors: string[];
  mood: string;
  subject: string;
  composition: string;
}

export async function analyzeImage(imageUrl: string): Promise<ImageAnalysisResult | null> {
  try {
    const genAI = getGeminiClient();
    if (!genAI) {
      console.warn('Gemini API key not configured. Image analysis will be skipped.');
      return null;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    const imageBlob = await imageResponse.blob();
    const imageBase64 = await blobToBase64(imageBlob);

    const prompt = `You are an expert image analyzer. Please analyze this image and provide a detailed analysis in JSON format.

Instructions:
1. Provide a concise description of the image (2-3 sentences)
2. List 5-7 relevant tags that describe the image content
3. Identify 3-5 dominant colors in hex format (e.g., "#FF0000")
4. Describe the overall mood or atmosphere
5. Identify the main subject or focus
6. Describe the composition style or layout

Return ONLY a JSON object with the following structure:
{
  "description": "string",
  "tags": ["string", "string"],
  "colors": ["#hex", "#hex"],
  "mood": "string",
  "subject": "string",
  "composition": "string"
}`;

    // Create parts array for the model
    const parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64
        }
      }
    ];

    // Generate content with parts array
    const result = await model.generateContent(parts);
    await result.response;
    
    const text = result.response.text();
    console.log('Raw Gemini Response:', text);
    
    try {
      // Try to extract JSON from the response if it's wrapped in text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      
      // Parse the JSON response
      const analysis = JSON.parse(jsonStr);
      
      // Validate the response structure
      if (!analysis.description || !analysis.tags || !analysis.colors) {
        throw new Error('Response missing required fields');
      }
      
      return {
        description: analysis.description || 'No description available',
        tags: Array.isArray(analysis.tags) ? analysis.tags : [],
        colors: Array.isArray(analysis.colors) ? analysis.colors : [],
        mood: analysis.mood || 'Unknown mood',
        subject: analysis.subject || 'Unknown subject',
        composition: analysis.composition || 'Unknown composition',
      };
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      console.error('Parse error:', parseError);
      throw new Error(`Invalid response format from Gemini API: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error instanceof Error ? error : new Error('Failed to analyze image');
  }
}

// Helper function to convert Blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
} 