import { Test, TestingModule } from '@nestjs/testing';
import { BorderPointsController } from './border-points.controller';

describe('BorderPointsController', () => {
  let controller: BorderPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorderPointsController],
    }).compile();

    controller = module.get<BorderPointsController>(BorderPointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
