import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function generateSummary(text: string): Promise<string> {
  try {
    const prompt = `
      Please provide a concise 2-3 sentence summary of the following text, focusing on the key points and insights:

      ${text}

      Summary:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    return '';
  }
}

export async function analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
  try {
    const prompt = `
      Analyze the sentiment of the following text and respond with ONLY one word - either "positive", "negative", or "neutral":

      ${text}

      Sentiment:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const sentiment = response.text().toLowerCase().trim();

    if (sentiment === 'positive' || sentiment === 'negative' || sentiment === 'neutral') {
      return sentiment;
    }
    return 'neutral';
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return 'neutral';
  }
}

export async function extractTopics(text: string): Promise<string[]> {
  try {
    const prompt = `
      Extract 3-5 main topics or themes from the following text. 
      Respond with ONLY the topics, one per line, no numbers or bullets:

      ${text}

      Topics:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text()
      .split('\n')
      .map(topic => topic.trim())
      .filter(topic => topic.length > 0);
  } catch (error) {
    console.error('Error extracting topics:', error);
    return [];
  }
} 