import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateTelegramUser(telegramUser: any) {
    const user = await this.prisma.user.upsert({
      where: { telegramId: telegramUser.id.toString() },
      update: { username: telegramUser.username },
      create: {
        telegramId: telegramUser.id.toString(),
        username: telegramUser.username,
        role: 'USER',
      },
    });

    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
