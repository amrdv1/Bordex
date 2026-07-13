import { Module } from '@nestjs/common';
import { BorderPointsController } from './border-points.controller';
import { BorderPointsService } from './border-points.service';

@Module({
  controllers: [BorderPointsController],
  providers: [BorderPointsService]
})
export class BorderPointsModule {}
