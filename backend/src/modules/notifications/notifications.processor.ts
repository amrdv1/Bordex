import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private telegramBot: TelegramBotService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'sendNotification') {
      const { telegramId, text, notificationId } = job.data;
      this.logger.log(`Processing notification job ${job.id} for user ${telegramId}`);
      try {
        await this.telegramBot.sendMessage(telegramId, text);
        return { success: true, notificationId };
      } catch (err) {
        this.logger.error(`Failed to send notification ${job.id}`, err);
        throw err;
      }
    }
  }
}
