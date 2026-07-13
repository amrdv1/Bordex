import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private telegramBot: TelegramBotService,
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async checkAndQueueNotifications(borderPointId: string, currentData: any) {
    const activeNotifications = await this.prisma.notification.findMany({
      where: { borderPointId, isActive: true },
      include: { user: true, borderPoint: true },
    });

    for (const notif of activeNotifications) {
      let trigger = false;
      let currentValue = 0;

      switch (notif.vehicleType) {
        case 'CARS': currentValue = currentData.cars; break;
        case 'TRUCKS': currentValue = currentData.trucks; break;
        case 'BUSES': currentValue = currentData.buses; break;
        case 'PEDESTRIANS': currentValue = currentData.pedestrians; break;
        case 'WAIT_TIME': currentValue = currentData.waitTimeMins; break;
      }

      if (notif.conditionType === 'LESS_THAN' && currentValue < notif.thresholdValue) {
        trigger = true;
      } else if (notif.conditionType === 'GREATER_THAN' && currentValue > notif.thresholdValue) {
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

  private getTypeName(type: string) {
    switch (type) {
      case 'CARS': return 'Легковые авто';
      case 'TRUCKS': return 'Грузовики';
      case 'BUSES': return 'Автобусы';
      case 'PEDESTRIANS': return 'Пешеходы';
      case 'WAIT_TIME': return 'Время ожидания (мин)';
      default: return 'Очередь';
    }
  }
}
