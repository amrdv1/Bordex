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
        .text('🇺🇦 Кордони', 'menu_borders').row()
        .text('⭐ Обране', 'menu_favorites').row()
        .text('🔔 Налаштування сповіщень', 'menu_settings');

      await ctx.reply(
        'Вітаємо у Bordex! 🚗\nДізнавайтесь актуальну інформацію про черги на кордонах України.',
        { reply_markup: keyboard }
      );
    });

    this.bot.callbackQuery('menu_borders', async (ctx) => {
      const countries = await this.prisma.country.findMany();
      if (countries.length === 0) {
        return ctx.editMessageText('На жаль, країни поки не додані до бази даних.');
      }

      const keyboard = new InlineKeyboard();
      countries.forEach(country => {
        keyboard.text(country.name, `country_${country.code}`).row();
      });
      keyboard.text('🔙 Назад', 'menu_main');

      await ctx.editMessageText('Оберіть країну:', { reply_markup: keyboard });
    });

    this.bot.callbackQuery('menu_main', async (ctx) => {
      const keyboard = new InlineKeyboard()
        .text('🇺🇦 Кордони', 'menu_borders').row()
        .text('⭐ Обране', 'menu_favorites').row()
        .text('🔔 Налаштування сповіщень', 'menu_settings');

      await ctx.editMessageText(
        'Вітаємо у Bordex! 🚗\nДізнавайтесь актуальну інформацію про черги на кордонах України.',
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
        return ctx.editMessageText('У цій країні немає пунктів пропуску.', { reply_markup: kb });
      }

      const keyboard = new InlineKeyboard();
      points.forEach(point => {
        const cars = point.queueData?.cars ?? 0;
        const icon = cars > 100 ? '🔴' : cars > 50 ? '🟡' : '🟢';
        keyboard.text(`${icon} ${point.name}`, `point_${point.id}`).row();
      });
      keyboard.text('🔙 Назад до країн', 'menu_borders');

      await ctx.editMessageText('Оберіть пункт пропуску:', { reply_markup: keyboard });
    });

    this.bot.callbackQuery(/^point_(.+)$/, async (ctx) => {
      const id = ctx.match[1];
      const point = await this.prisma.borderPoint.findUnique({
        where: { id },
        include: { queueData: true, country: true }
      });

      if (!point) return ctx.answerCallbackQuery('Пункт не знайдено.');

      const q = point.queueData;
      const text = `
📍 <b>${point.name}</b> (${point.country.name})
Статус: ${point.isOpen ? 'Відкрито ✅' : 'Закрито ❌'}

🚗 Легкові: ${q?.cars ?? 0}
🚛 Вантажівки: ${q?.trucks ?? 0}
🚌 Автобуси: ${q?.buses ?? 0}
🚶 Пішоходи: ${q?.pedestrians ?? 0}

⏱ Очікування: ~${q?.waitTimeMins ?? 0} хвилин

<i>Оновлено: ${q?.lastUpdated ? q.lastUpdated.toLocaleString() : 'Немає даних'}</i>
      `;

      const kb = new InlineKeyboard()
        .text('⭐ В обране', `fav_add_${point.id}`).row()
        .text('🔔 Сповістити про зміни', `notify_${point.id}`).row()
        .text('🔙 Назад', `country_${point.country.code}`);

      await ctx.editMessageText(text, { reply_markup: kb, parse_mode: 'HTML' });
    });

    this.bot.callbackQuery(/^notify_(.+)$/, async (ctx) => {
      const id = ctx.match[1];
      const kb = new InlineKeyboard()
        .text('🚗 Менше 50 авто', `sub_${id}_CARS_LESS_THAN_50`).row()
        .text('🚗 Менше 20 авто', `sub_${id}_CARS_LESS_THAN_20`).row()
        .text('🔙 Назад до пункту', `point_${id}`);
        
      await ctx.editMessageText('Оберіть умову для сповіщення:', { reply_markup: kb });
    });

    this.bot.callbackQuery(/^sub_(.+)_(CARS)_(LESS_THAN)_(\d+)$/, async (ctx) => {
      const [_, pointId, vehicleType, conditionType, thresholdValue] = ctx.match;
      
      const user = await this.prisma.user.findUnique({
        where: { telegramId: ctx.from.id.toString() }
      });

      if (!user) return ctx.answerCallbackQuery('Користувача не знайдено. Натисніть /start');

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

      const kb = new InlineKeyboard().text('🔙 Повернутися до пункту', `point_${pointId}`);
      await ctx.editMessageText(`✅ Ви успішно підписалися!\nМи надішлемо сповіщення, коли черга стане ${conditionType === 'LESS_THAN' ? 'менше' : 'більше'} ${thresholdValue} авто.`, { reply_markup: kb });
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
