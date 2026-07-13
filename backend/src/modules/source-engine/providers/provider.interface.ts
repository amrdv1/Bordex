export interface QueueMetrics {
  cars: number;
  trucks: number;
  buses: number;
  pedestrians: number;
  waitTimeMins: number;
  confidenceScore: number; // 0.0 to 1.0 (confidence in the data source)
}

export interface SourceProvider {
  name: string;
  fetchData(pointName: string): Promise<Partial<QueueMetrics> | null>;
}
