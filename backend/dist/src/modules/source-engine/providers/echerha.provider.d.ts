import { SourceProvider, QueueMetrics } from './provider.interface';
export declare class ECherhaProvider implements SourceProvider {
    name: string;
    fetchData(pointName: string): Promise<Partial<QueueMetrics> | null>;
}
