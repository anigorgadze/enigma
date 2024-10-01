import { Controller, Post, Body } from '@nestjs/common';
import { TikTokService } from './tiktok.service';

@Controller('tiktok')
export class TikTokController {
  constructor(private readonly tiktokService: TikTokService) {}

  @Post('token')
  async getAccessToken(@Body('code') code: string) {
    return await this.tiktokService.fetchAccessToken(code);
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return await this.tiktokService.refreshAccessToken(refreshToken);
  }

  @Post('revoke')
  async revokeToken(@Body('token') token: string) {
    return await this.tiktokService.revokeAccess(token);
  }
}
