import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

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
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const imageBase64 = await blobToBase64(imageBlob);

    const prompt = `Analyze this image and provide:
    1. A brief description
    2. Relevant tags
    3. Dominant colors
    4. Overall mood
    5. Main subject
    6. Composition style
    Format as JSON with keys: description, tags (array), colors (array), mood, subject, composition`;

    const result = await model.generateContent([prompt, { inlineData: { data: await imageBase64, mimeType: 'image/jpeg' } }]);
    const generatedResponse = await result.response;
    const text = generatedResponse.text();
    
    // Parse the JSON response
    const analysis = JSON.parse(text);
    
    return {
      description: analysis.description || '',
      tags: analysis.tags || [],
      colors: analysis.colors || [],
      mood: analysis.mood || '',
      subject: analysis.subject || '',
      composition: analysis.composition || '',
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
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
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
} 