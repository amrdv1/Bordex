import { SourceProvider, QueueMetrics } from './provider.interface';

export class ECherhaProvider implements SourceProvider {
  name = 'eCherha';

  async fetchData(pointName: string): Promise<Partial<QueueMetrics> | null> {
    // В реальном проекте здесь будет axios.get('https://echerha.gov.ua/api/...')
    if (pointName === 'Ягодин') {
      return { trucks: 450, buses: 12, waitTimeMins: 1440, confidenceScore: 0.95 };
    }
    return null;
  }
}
