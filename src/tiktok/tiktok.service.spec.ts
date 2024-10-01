import { Test, TestingModule } from '@nestjs/testing';
import { TikTokService } from './tiktok.service';

describe('TiktokService', () => {
  let service: TikTokService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TikTokService],
    }).compile();

    service = module.get<TikTokService>(TikTokService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
