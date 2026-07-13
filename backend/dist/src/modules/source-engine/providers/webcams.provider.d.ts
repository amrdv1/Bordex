import { SourceProvider, QueueMetrics } from './provider.interface';
export declare class WebcamsProvider implements SourceProvider {
    name: string;
    fetchData(pointName: string): Promise<Partial<QueueMetrics> | null>;
}
