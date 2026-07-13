import { Test, TestingModule } from '@nestjs/testing';
import { SourceEngineService } from './source-engine.service';
import { PrismaService } from '../../prisma.service';

describe('SourceEngineService', () => {
  let service: SourceEngineService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SourceEngineService,
        {
          provide: PrismaService,
          useValue: {
            source: {
              findMany: jest.fn().mockResolvedValue([{ name: 'dpsu.gov.ua' }])
            },
            borderPoint: {
              findMany: jest.fn().mockResolvedValue([]),
              findFirst: jest.fn().mockResolvedValue(null)
            },
            queueData: {
              upsert: jest.fn()
            },
            queueHistory: {
              create: jest.fn()
            }
          }
        }
      ],
    }).compile();

    service = module.get<SourceEngineService>(SourceEngineService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch from sources', async () => {
    await service.fetchFromSources();
    expect(prismaService.source.findMany).toHaveBeenCalled();
  });
});
