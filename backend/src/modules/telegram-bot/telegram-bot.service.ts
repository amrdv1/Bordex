import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, InlineKeyboard } from 'grammy';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TelegramBotService implements OnModuleInit {
  private bot: Bot;
  private readonly logger = new Logger(TelegramBotService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (token && token !== 'YOUR_TELEGRAM_BOT_TOKEN') {
      this.bot = new Bot(token);
    } else {
      this.logger.warn('Telegram Bot Token is missing or not set. Bot will not start.');
    }
  }

  async onModuleInit() {
    if (!this.bot) return;

    this.setupHandlers();
    
    // Start bot asynchronously
    this.bot.start({
      onStart: (botInfo) => {
        this.logger.log(`Bot @${botInfo.username} started successfully.`);
      }
    }).catch(err => this.logger.error('Failed to start telegram bot', err));
  }

  private setupHandlers() {
    this.bot.command('start', async (ctx) => {
      // Save or update user
      if (ctx.from) {
        await this.prisma.user.upsert({
          where: { telegramId: ctx.from.id.toString() },
          update: { username: ctx.from.username },
          create: {
            telegramId: ctx.from.id.toString(),
            username: ctx.from.username,
          },
        });
      }

      const keyboard = new InlineKeyboard()
        .text('🇺🇦 Границы', 'menu_borders').row()
        .text('⭐ Избранное', 'menu_favorites').row()
        .text('🔔 Настройки уведомлений', 'menu_settings');

      await ctx.reply(
        'Добро пожаловать в BorderFlow! 🚗\nУзнавайте актуальную информацию об очередях на границах Украины.',
        { reply_markup: keyboard }
      );
    });

    this.bot.callbackQuery('menu_borders', async (ctx) => {
      const countries = await this.prisma.country.findMany();
      if (countries.length === 0) {
        return ctx.editMessageText('К сожалению, страны пока не добавлены в базу данных.');
      }

      const keyboard = new InlineKeyboard();
      countries.forEach(country => {
        keyboard.text(country.name, `country_${country.code}`).row();
      });
      keyboard.text('🔙 Назад', 'menu_main');

      await ctx.editMessageText('Выберите страну:', { reply_markup: keyboard });
    });

    this.bot.callbackQuery('menu_main', async (ctx) => {
      const keyboard = new InlineKeyboard()
        .text('🇺🇦 Границы', 'menu_borders').row()
        .text('⭐ Избранное', 'menu_favorites').row()
        .text('🔔 Настройки уведомлений', 'menu_settings');

      await ctx.editMessageText(
        'Добро пожаловать в BorderFlow! 🚗\nУзнавайте актуальную информацию об очередях на границах Украины.',
        { reply_markup: keyboard }
      );
    });

    this.bot.callbackQuery(/^country_(.+)$/, async (ctx) => {
      const code = ctx.match[1];
      const points = await this.prisma.borderPoint.findMany({
        where: { country: { code } },
        include: { queueData: true }
      });

      if (points.length === 0) {
        const kb = new InlineKeyboard().text('🔙 Назад', 'menu_borders');
        return ctx.editMessageText('В данной стране нет пунктов пропуска.', { reply_markup: kb });
      }

      const keyboard = new InlineKeyboard();
      points.forEach(point => {
        const cars = point.queueData?.cars ?? 0;
        const icon = cars > 100 ? '🔴' : cars > 50 ? '🟡' : '🟢';
        keyboard.text(`${icon} ${point.name}`, `point_${point.id}`).row();
      });
      keyboard.text('🔙 Назад к странам', 'menu_borders');

      await ctx.editMessageText('Выберите пункт пропуска:', { reply_markup: keyboard });
    });

    this.bot.callbackQuery(/^point_(.+)$/, async (ctx) => {
      const id = ctx.match[1];
      const point = await this.prisma.borderPoint.findUnique({
        where: { id },
        include: { queueData: true, country: true }
      });

      if (!point) return ctx.answerCallbackQuery('Пункт не найден.');

      const q = point.queueData;
      const text = `
📍 <b>${point.name}</b> (${point.country.name})
Статус: ${point.isOpen ? 'Открыт ✅' : 'Закрыт ❌'}

🚗 Легковые: ${q?.cars ?? 0}
🚛 Грузовики: ${q?.trucks ?? 0}
🚌 Автобусы: ${q?.buses ?? 0}
🚶 Пешеходы: ${q?.pedestrians ?? 0}

⏱ Ожидание: ~${q?.waitTimeMins ?? 0} минут

<i>Обновлено: ${q?.lastUpdated ? q.lastUpdated.toLocaleString() : 'Нет данных'}</i>
      `;

      const kb = new InlineKeyboard()
        .text('⭐ В избранное', `fav_add_${point.id}`).row()
        .text('🔔 Уведомить об изменениях', `notify_${point.id}`).row()
        .text('🔙 Назад', `country_${point.country.code}`);

      await ctx.editMessageText(text, { reply_markup: kb, parse_mode: 'HTML' });
    });

    this.bot.callbackQuery(/^notify_(.+)$/, async (ctx) => {
      const id = ctx.match[1];
      const kb = new InlineKeyboard()
        .text('🚗 Меньше 50 авто', `sub_${id}_CARS_LESS_THAN_50`).row()
        .text('🚗 Меньше 20 авто', `sub_${id}_CARS_LESS_THAN_20`).row()
        .text('🔙 Назад к пункту', `point_${id}`);
        
      await ctx.editMessageText('Выберите условие для уведомления:', { reply_markup: kb });
    });

    this.bot.callbackQuery(/^sub_(.+)_(CARS)_(LESS_THAN)_(\d+)$/, async (ctx) => {
      const [_, pointId, vehicleType, conditionType, thresholdValue] = ctx.match;
      
      const user = await this.prisma.user.findUnique({
        where: { telegramId: ctx.from.id.toString() }
      });

      if (!user) return ctx.answerCallbackQuery('Пользователь не найден. Нажмите /start');

      await this.prisma.notification.create({
        data: {
          userId: user.id,
          borderPointId: pointId,
          vehicleType,
          conditionType,
          thresholdValue: parseInt(thresholdValue, 10),
          isActive: true
        }
      });

      const kb = new InlineKeyboard().text('🔙 Вернуться к пункту', `point_${pointId}`);
      await ctx.editMessageText(`✅ Вы успешно подписались!\nМы пришлем уведомление, когда очередь станет ${conditionType === 'LESS_THAN' ? 'меньше' : 'больше'} ${thresholdValue} авто.`, { reply_markup: kb });
    });

    this.bot.catch((err) => {
      this.logger.error('Error in bot:', err);
    });
  }

  public async sendMessage(chatId: string | number, text: string) {
    if (!this.bot) return;
    try {
      await this.bot.api.sendMessage(chatId, text, { parse_mode: 'HTML' });
    } catch (e) {
      this.logger.error(`Failed to send message to ${chatId}`, e);
    }
  }
}
