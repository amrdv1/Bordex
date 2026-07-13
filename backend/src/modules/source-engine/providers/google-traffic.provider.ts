import { SourceProvider, QueueMetrics } from './provider.interface';

export class GoogleTrafficProvider implements SourceProvider {
  name = 'Google Maps Traffic API';

  async fetchData(pointName: string): Promise<Partial<QueueMetrics> | null> {
    // В реальном проекте здесь интеграция с Google Distance Matrix API with traffic_model
    if (pointName === 'Ягодин') {
      return { waitTimeMins: 1200, confidenceScore: 0.70 }; // Затор на 20 часов
    }
    return null;
  }
}
