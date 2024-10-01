// import { Module } from '@nestjs/common';

// import { HttpModule } from '@nestjs/axios';
// import { ConfigModule } from '@nestjs/config';
// import { TikTokAuthController } from './tiktok.auth.controller';
// import { TikTokAuthService } from './tiktok.auth.service';

// @Module({
//   imports: [HttpModule, ConfigModule],
//   controllers: [TikTokAuthController],
//   providers: [TikTokAuthService],
// })
// export class TikTokAuthModule {}


import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { TikTokAuthController } from './tiktok.auth.controller';
import { TikTokService } from './tiktok.service';

@Module({
  imports: [HttpModule],
  controllers: [TikTokAuthController],
  providers: [TikTokService],
})
export class TikTokAuthModule {}
