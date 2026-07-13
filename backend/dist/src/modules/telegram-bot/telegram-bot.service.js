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
var TelegramBotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBotService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const grammy_1 = require("grammy");
const prisma_service_1 = require("../../prisma.service");
let TelegramBotService = TelegramBotService_1 = class TelegramBotService {
    configService;
    prisma;
    bot;
    logger = new common_1.Logger(TelegramBotService_1.name);
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const token = this.configService.get('TELEGRAM_BOT_TOKEN');
        if (token && token !== 'YOUR_TELEGRAM_BOT_TOKEN') {
            this.bot = new grammy_1.Bot(token);
        }
        else {
            this.logger.warn('Telegram Bot Token is missing or not set. Bot will not start.');
        }
    }
    async onModuleInit() {
        if (!this.bot)
            return;
        this.setupHandlers();
        this.bot.start({
            onStart: (botInfo) => {
                this.logger.log(`Bot @${botInfo.username} started successfully.`);
            }
        }).catch(err => this.logger.error('Failed to start telegram bot', err));
    }
    setupHandlers() {
        this.bot.command('start', async (ctx) => {
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
            const keyboard = new grammy_1.InlineKeyboard()
                .text('🇺🇦 Кордони', 'menu_borders').row()
                .text('⭐ Обране', 'menu_favorites').row()
                .text('🔔 Налаштування сповіщень', 'menu_settings');
            await ctx.reply('Вітаємо у Bordex! 🚗\nДізнавайтесь актуальну інформацію про черги на кордонах України.', { reply_markup: keyboard });
        });
        this.bot.callbackQuery('menu_borders', async (ctx) => {
            const countries = await this.prisma.country.findMany();
            if (countries.length === 0) {
                return ctx.editMessageText('На жаль, країни поки не додані до бази даних.');
            }
            const keyboard = new grammy_1.InlineKeyboard();
            countries.forEach(country => {
                keyboard.text(country.name, `country_${country.code}`).row();
            });
            keyboard.text('🔙 Назад', 'menu_main');
            await ctx.editMessageText('Оберіть країну:', { reply_markup: keyboard });
        });
        this.bot.callbackQuery('menu_main', async (ctx) => {
            const keyboard = new grammy_1.InlineKeyboard()
                .text('🇺🇦 Кордони', 'menu_borders').row()
                .text('⭐ Обране', 'menu_favorites').row()
                .text('🔔 Налаштування сповіщень', 'menu_settings');
            await ctx.editMessageText('Вітаємо у Bordex! 🚗\nДізнавайтесь актуальну інформацію про черги на кордонах України.', { reply_markup: keyboard });
        });
        this.bot.callbackQuery(/^country_(.+)$/, async (ctx) => {
            const code = ctx.match[1];
            const points = await this.prisma.borderPoint.findMany({
                where: { country: { code } },
                include: { queueData: true }
            });
            if (points.length === 0) {
                const kb = new grammy_1.InlineKeyboard().text('🔙 Назад', 'menu_borders');
                return ctx.editMessageText('У цій країні немає пунктів пропуску.', { reply_markup: kb });
            }
            const keyboard = new grammy_1.InlineKeyboard();
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
            if (!point)
                return ctx.answerCallbackQuery('Пункт не знайдено.');
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
            const kb = new grammy_1.InlineKeyboard()
                .text('⭐ В обране', `fav_add_${point.id}`).row()
                .text('🔔 Сповістити про зміни', `notify_${point.id}`).row()
                .text('🔙 Назад', `country_${point.country.code}`);
            await ctx.editMessageText(text, { reply_markup: kb, parse_mode: 'HTML' });
        });
        this.bot.callbackQuery(/^notify_(.+)$/, async (ctx) => {
            const id = ctx.match[1];
            const kb = new grammy_1.InlineKeyboard()
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
            if (!user)
                return ctx.answerCallbackQuery('Користувача не знайдено. Натисніть /start');
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
            const kb = new grammy_1.InlineKeyboard().text('🔙 Повернутися до пункту', `point_${pointId}`);
            await ctx.editMessageText(`✅ Ви успішно підписалися!\nМи надішлемо сповіщення, коли черга стане ${conditionType === 'LESS_THAN' ? 'менше' : 'більше'} ${thresholdValue} авто.`, { reply_markup: kb });
        });
        this.bot.catch((err) => {
            this.logger.error('Error in bot:', err);
        });
    }
    async sendMessage(chatId, text) {
        if (!this.bot)
            return;
        try {
            await this.bot.api.sendMessage(chatId, text, { parse_mode: 'HTML' });
        }
        catch (e) {
            this.logger.error(`Failed to send message to ${chatId}`, e);
        }
    }
};
exports.TelegramBotService = TelegramBotService;
exports.TelegramBotService = TelegramBotService = TelegramBotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], TelegramBotService);
//# sourceMappingURL=telegram-bot.service.js.map