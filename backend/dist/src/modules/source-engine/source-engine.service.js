"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SourceEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const schedule_1 = require("@nestjs/schedule");
const echerha_provider_1 = require("./providers/echerha.provider");
const google_traffic_provider_1 = require("./providers/google-traffic.provider");
const granica_pl_provider_1 = require("./providers/granica-pl.provider");
const webcams_provider_1 = require("./providers/webcams.provider");
let SourceEngineService = SourceEngineService_1 = class SourceEngineService {
    prisma;
    logger = new common_1.Logger(SourceEngineService_1.name);
    providers = [];
    constructor(prisma) {
        this.prisma = prisma;
        this.providers = [
            new echerha_provider_1.ECherhaProvider(),
            new google_traffic_provider_1.GoogleTrafficProvider(),
            new granica_pl_provider_1.GranicaPlProvider(),
            new webcams_provider_1.WebcamsProvider()
        ];
    }
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
            const validResults = results.filter((r) => r !== null);
            if (validResults.length > 0) {
                const mergedData = this.mergeMetrics(validResults);
                await this.saveMergedData(point.id, mergedData);
            }
            else {
                await this.mockDataForPoint(point.id);
            }
        }
    }
    mergeMetrics(metrics) {
        let totalScore = 0;
        let weightedCars = 0;
        let weightedWaitTime = 0;
        for (const m of metrics) {
            const score = m.confidenceScore || 0.5;
            totalScore += score;
            if (m.cars !== undefined)
                weightedCars += m.cars * score;
            if (m.waitTimeMins !== undefined)
                weightedWaitTime += m.waitTimeMins * score;
        }
        if (totalScore === 0)
            totalScore = 1;
        return {
            cars: Math.round(weightedCars / totalScore),
            waitTimeMins: Math.round(weightedWaitTime / totalScore),
        };
    }
    async saveMergedData(pointId, data) {
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
    async mockDataForPoint(pointId) {
        const cars = Math.floor(Math.random() * 200);
        const waitTime = cars * 1.5;
        await this.saveMergedData(pointId, { cars, waitTimeMins: waitTime });
    }
};
exports.SourceEngineService = SourceEngineService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SourceEngineService.prototype, "handleCron", null);
exports.SourceEngineService = SourceEngineService = SourceEngineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SourceEngineService);
//# sourceMappingURL=source-engine.service.js.map