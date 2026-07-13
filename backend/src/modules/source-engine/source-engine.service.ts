import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SourceProvider, QueueMetrics } from './providers/provider.interface';
import { NakordoniProvider } from './providers/nakordoni.provider';

@Injectable()
export class SourceEngineService implements OnModuleInit {
  private readonly logger = new Logger(SourceEngineService.name);
  private providers: SourceProvider[] = [];

  constructor(private prisma: PrismaService) {
    this.providers = [
      new NakordoniProvider()
    ];
  }

  async onModuleInit() {
    this.logger.log('Running initial data aggregation on startup...');
    // Do not await to avoid blocking server startup
    this.aggregateData().catch(e => this.logger.error('Initial aggregation failed', e));
  }

  @Cron('0 */2 * * *')
  async handleCron() {
    this.logger.log('Running Aggregation Engine (Multi-Source Fetch)...');
    await this.aggregateData();
  }

  async aggregateData() {
    const points = await this.prisma.borderPoint.findMany();
    
    for (const point of points) {
      this.logger.log(`Aggregating data for point: ${point.name}`);
      
      const promises = this.providers.map(p => p.fetchData(point.name).catch(e => {
        this.logger.error(`Provider ${p.name} failed for ${point.name}`, e);
        return null;
      }));

      const results = await Promise.all(promises);
      const validResults = results.filter((r): r is Partial<QueueMetrics> => r !== null);

      if (validResults.length > 0) {
        const mergedData = this.mergeMetrics(validResults);
        await this.saveMergedData(point.id, mergedData);
      } else {
        // Fallback to 0 if provider fails
        await this.saveMergedData(point.id, { cars: 0, waitTimeMins: 0 });
      }
    }
  }

  private mergeMetrics(metrics: Partial<QueueMetrics>[]): Partial<QueueMetrics> {
    let totalScore = 0;
    let weightedCars = 0;
    let weightedWaitTime = 0;
    
    // Simplistic weighted average merger based on confidenceScore
    for (const m of metrics) {
      const score = m.confidenceScore || 0.5;
      totalScore += score;
      if (m.cars !== undefined) weightedCars += m.cars * score;
      if (m.waitTimeMins !== undefined) weightedWaitTime += m.waitTimeMins * score;
    }

    if (totalScore === 0) totalScore = 1;

    return {
      cars: Math.round(weightedCars / totalScore),
      waitTimeMins: Math.round(weightedWaitTime / totalScore),
    };
  }

  private async saveMergedData(pointId: string, data: Partial<QueueMetrics>) {
    await this.prisma.queueData.upsert({
      where: { borderPointId: pointId },
      update: {
        cars: data.cars || 0,
        waitTimeMins: data.waitTimeMins || 0,
        lastUpdated: new Date()
      },
      create: {
        borderPointId: pointId,
        cars: data.cars || 0,
        trucks: data.trucks || 0,
        buses: data.buses || 0,
        pedestrians: data.pedestrians || 0,
        waitTimeMins: data.waitTimeMins || 0,
        lastUpdated: new Date()
      }
    });

    await this.prisma.queueHistory.create({
      data: {
        borderPointId: pointId,
        cars: data.cars || 0,
        trucks: data.trucks || 0,
        buses: data.buses || 0,
        pedestrians: data.pedestrians || 0,
        waitTimeMins: data.waitTimeMins || 0,
      }
    });
    this.logger.log(`Saved aggregated data for point ${pointId}`);
  }

}
