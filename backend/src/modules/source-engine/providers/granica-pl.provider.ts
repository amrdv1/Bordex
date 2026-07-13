import { SourceProvider, QueueMetrics } from './provider.interface';

export class GranicaPlProvider implements SourceProvider {
  name = 'granica.gov.pl';

  async fetchData(pointName: string): Promise<Partial<QueueMetrics> | null> {
    // В реальном проекте здесь парсинг granica.gov.pl
    if (pointName === 'Ягодин') {
      return { cars: 150, waitTimeMins: 300, confidenceScore: 0.85 };
    }
    return null;
  }
}
