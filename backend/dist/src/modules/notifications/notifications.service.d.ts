import { PrismaService } from '../../prisma.service';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { Queue } from 'bullmq';
export declare class NotificationsService {
    private prisma;
    private telegramBot;
    private notificationsQueue;
    private readonly logger;
    constructor(prisma: PrismaService, telegramBot: TelegramBotService, notificationsQueue: Queue);
    checkAndQueueNotifications(borderPointId: string, currentData: any): Promise<void>;
    private getTypeName;
}
