import { ContentGenerator } from '../ai/contentGenerator';

export class TelegramContentEnhancer {
  constructor(private ai: ContentGenerator) {}

  async enhanceContent(text: string): Promise<string> {
    const prompt = {
      topic: text,
      style: 'informative' as const,
      targetLength: 800,
      keywords: this.extractKeywords(text)
    };

    const result = await this.ai.generateArticle(prompt);
    return result || text; // Return original text if generation fails
  }

  private extractKeywords(text: string): string[] {
    // Basic implementation
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 4)
      .slice(0, 5);
  }
} 