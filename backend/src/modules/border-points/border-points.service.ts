import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class BorderPointsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.borderPoint.findMany({
      include: {
        country: true,
        queueData: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.borderPoint.findUnique({
      where: { id },
      include: {
        country: true,
        queueData: true,
      },
    });
  }

  async findByCountry(countryCode: string) {
    return this.prisma.borderPoint.findMany({
      where: {
        country: {
          code: countryCode.toUpperCase(),
        },
      },
      include: {
        queueData: true,
      },
    });
  }
}
