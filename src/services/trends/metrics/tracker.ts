export interface ContentMetrics {
  views: number;
  engagement: number;
  shareRate: number;
  viralScore: number;
}

export class PerformanceTracker {
  async trackContent(contentId: string): Promise<ContentMetrics> {
    // Default implementation
    return {
      views: 0,
      engagement: 0,
      shareRate: 0,
      viralScore: 0
    };
  }
} 