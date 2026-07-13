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
var NotificationsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const telegram_bot_service_1 = require("../telegram-bot/telegram-bot.service");
let NotificationsProcessor = NotificationsProcessor_1 = class NotificationsProcessor extends bullmq_1.WorkerHost {
    telegramBot;
    logger = new common_1.Logger(NotificationsProcessor_1.name);
    constructor(telegramBot) {
        super();
        this.telegramBot = telegramBot;
    }
    async process(job) {
        if (job.name === 'sendNotification') {
            const { telegramId, text, notificationId } = job.data;
            this.logger.log(`Processing notification job ${job.id} for user ${telegramId}`);
            try {
                await this.telegramBot.sendMessage(telegramId, text);
                return { success: true, notificationId };
            }
            catch (err) {
                this.logger.error(`Failed to send notification ${job.id}`, err);
                throw err;
            }
        }
    }
};
exports.NotificationsProcessor = NotificationsProcessor;
exports.NotificationsProcessor = NotificationsProcessor = NotificationsProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('notifications'),
    __metadata("design:paramtypes", [telegram_bot_service_1.TelegramBotService])
], NotificationsProcessor);
//# sourceMappingURL=notifications.processor.js.map