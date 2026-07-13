import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { BullModule } from '@nestjs/bullmq';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';
import { NotificationsProcessor } from './notifications.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
    TelegramBotModule,
  ],
  providers: [NotificationsService, NotificationsProcessor],
  exports: [NotificationsService]
})
export class NotificationsModule {}
