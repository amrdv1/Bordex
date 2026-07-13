import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
export declare class NotificationsProcessor extends WorkerHost {
    private telegramBot;
    private readonly logger;
    constructor(telegramBot: TelegramBotService);
    process(job: Job<any, any, string>): Promise<any>;
}
