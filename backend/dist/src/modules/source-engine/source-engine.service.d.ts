import { PrismaService } from '../../prisma.service';
export declare class SourceEngineService {
    private prisma;
    private readonly logger;
    private providers;
    constructor(prisma: PrismaService);
    handleCron(): Promise<void>;
    aggregateData(): Promise<void>;
    private mergeMetrics;
    private saveMergedData;
    private mockDataForPoint;
}
