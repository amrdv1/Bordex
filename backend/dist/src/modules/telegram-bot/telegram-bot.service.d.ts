import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
export declare class TelegramBotService implements OnModuleInit {
    private configService;
    private prisma;
    private bot;
    private readonly logger;
    constructor(configService: ConfigService, prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private setupHandlers;
    sendMessage(chatId: string | number, text: string): Promise<void>;
}
