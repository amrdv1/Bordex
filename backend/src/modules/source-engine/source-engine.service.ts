import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SourceProvider, QueueMetrics } from './providers/provider.interface';
import { ECherhaProvider } from './providers/echerha.provider';
import { GoogleTrafficProvider } from './providers/google-traffic.provider';
import { GranicaPlProvider } from './providers/granica-pl.provider';
import { WebcamsProvider } from './providers/webcams.provider';

@Injectable()
export class SourceEngineService {
  private readonly logger = new Logger(SourceEngineService.name);
  private providers: SourceProvider[] = [];

  constructor(private prisma: PrismaService) {
    this.providers = [
      new ECherhaProvider(),
      new GoogleTrafficProvider(),
      new GranicaPlProvider(),
      new WebcamsProvider()
    ];
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
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
        // Fallback to mock if providers return nothing
        await this.mockDataForPoint(point.id);
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

  private async mockDataForPoint(pointId: string) {
      const cars = Math.floor(Math.random() * 200);
      const waitTime = cars * 1.5;

      await this.saveMergedData(pointId, { cars, waitTimeMins: waitTime });
  }
}
