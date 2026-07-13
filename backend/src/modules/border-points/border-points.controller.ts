import { Controller, Get, Param } from '@nestjs/common';
import { BorderPointsService } from './border-points.service';

@Controller('border-points')
export class BorderPointsController {
  constructor(private readonly borderPointsService: BorderPointsService) {}

  @Get()
  async getAll() {
    return this.borderPointsService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.borderPointsService.findOne(id);
  }

  @Get('country/:code')
  async getByCountry(@Param('code') code: string) {
    return this.borderPointsService.findByCountry(code);
  }
}
