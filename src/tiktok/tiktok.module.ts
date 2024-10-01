import { Module} from '@nestjs/common';
import { TikTokService } from './tiktok.service';
import { TikTokController } from './tiktok.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TikTokService],
  controllers: [TikTokController],
})
export class TikTokModule {}
