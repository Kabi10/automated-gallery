import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const getGeminiClient = () => {
  // Use NEXT_PUBLIC prefix for client-side access
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please set NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY in your environment variables.');
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

export async function analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    const imageBlob = await imageResponse.blob();
    const imageBase64 = await blobToBase64(imageBlob);

    const prompt = `Analyze this image and provide:
    1. A brief description
    2. Relevant tags
    3. Dominant colors (in hex format)
    4. Overall mood
    5. Main subject
    6. Composition style
    Format as JSON with keys: description, tags (array), colors (array), mood, subject, composition`;

    const result = await model.generateContent([prompt, { inlineData: { data: await imageBase64, mimeType: 'image/jpeg' } }]);
    const generatedResponse = await result.response;
    const text = generatedResponse.text();
    
    try {
      // Parse the JSON response
      const analysis = JSON.parse(text);
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
      throw new Error('Invalid response format from Gemini API');
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