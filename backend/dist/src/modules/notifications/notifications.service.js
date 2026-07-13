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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const telegram_bot_service_1 = require("../telegram-bot/telegram-bot.service");
const bullmq_1 = require("bullmq");
const bullmq_2 = require("@nestjs/bullmq");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    telegramBot;
    notificationsQueue;
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(prisma, telegramBot, notificationsQueue) {
        this.prisma = prisma;
        this.telegramBot = telegramBot;
        this.notificationsQueue = notificationsQueue;
    }
    async checkAndQueueNotifications(borderPointId, currentData) {
        const activeNotifications = await this.prisma.notification.findMany({
            where: { borderPointId, isActive: true },
            include: { user: true, borderPoint: true },
        });
        for (const notif of activeNotifications) {
            let trigger = false;
            let currentValue = 0;
            switch (notif.vehicleType) {
                case 'CARS':
                    currentValue = currentData.cars;
                    break;
                case 'TRUCKS':
                    currentValue = currentData.trucks;
                    break;
                case 'BUSES':
                    currentValue = currentData.buses;
                    break;
                case 'PEDESTRIANS':
                    currentValue = currentData.pedestrians;
                    break;
                case 'WAIT_TIME':
                    currentValue = currentData.waitTimeMins;
                    break;
            }
            if (notif.conditionType === 'LESS_THAN' && currentValue < notif.thresholdValue) {
                trigger = true;
            }
            else if (notif.conditionType === 'GREATER_THAN' && currentValue > notif.thresholdValue) {
                trigger = true;
            }
            if (trigger) {
                await this.notificationsQueue.add('sendNotification', {
                    telegramId: notif.user.telegramId,
                    text: `🔔 Уведомление: ${notif.borderPoint.name}\n${this.getTypeName(notif.vehicleType)} сейчас ${currentValue} (условие: ${notif.conditionType === 'LESS_THAN' ? '<' : '>'} ${notif.thresholdValue})`,
                    notificationId: notif.id,
                });
                await this.prisma.notification.update({
                    where: { id: notif.id },
                    data: { isActive: false }
                });
            }
        }
    }
    getTypeName(type) {
        switch (type) {
            case 'CARS': return 'Легковые авто';
            case 'TRUCKS': return 'Грузовики';
            case 'BUSES': return 'Автобусы';
            case 'PEDESTRIANS': return 'Пешеходы';
            case 'WAIT_TIME': return 'Время ожидания (мин)';
            default: return 'Очередь';
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_2.InjectQueue)('notifications')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegram_bot_service_1.TelegramBotService,
        bullmq_1.Queue])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map