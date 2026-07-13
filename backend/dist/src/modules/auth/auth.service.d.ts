import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
export declare class AuthService {
    private jwtService;
    private prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    validateTelegramUser(telegramUser: any): Promise<{
        access_token: string;
    }>;
}
