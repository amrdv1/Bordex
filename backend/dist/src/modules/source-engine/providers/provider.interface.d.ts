export interface QueueMetrics {
    cars: number;
    trucks: number;
    buses: number;
    pedestrians: number;
    waitTimeMins: number;
    confidenceScore: number;
}
export interface SourceProvider {
    name: string;
    fetchData(pointName: string): Promise<Partial<QueueMetrics> | null>;
}
