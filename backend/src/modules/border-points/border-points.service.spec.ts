import { Test, TestingModule } from '@nestjs/testing';
import { BorderPointsService } from './border-points.service';

describe('BorderPointsService', () => {
  let service: BorderPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorderPointsService],
    }).compile();

    service = module.get<BorderPointsService>(BorderPointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
