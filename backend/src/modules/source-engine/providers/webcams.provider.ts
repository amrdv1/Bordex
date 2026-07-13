import { SourceProvider, QueueMetrics } from './provider.interface';

export class WebcamsProvider implements SourceProvider {
  name = 'Webcams AI Analytics';

  async fetchData(pointName: string): Promise<Partial<QueueMetrics> | null> {
    // В реальном проекте здесь Computer Vision аналитика с RTSP видео-потоков веб-камер
    if (pointName === 'Ягодин') {
      return { cars: 115, waitTimeMins: 220, confidenceScore: 0.80 };
    }
    return null;
  }
}
