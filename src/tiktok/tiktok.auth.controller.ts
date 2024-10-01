import { Controller, Get, Query, Res, HttpStatus, Post, Body } from '@nestjs/common';

import { Response } from 'express';
import { TikTokService } from './tiktok.service';

@Controller('auth/tiktok')
export class TikTokAuthController {
  constructor(private readonly tiktokService: TikTokService) {}


  @Get('login')
  redirectToTikTok(@Res() res: Response) {
    console.log(encodeURIComponent(process.env.TIKTOK_REDIRECT_URI));
    const tiktokAuthUrl = `https://www.tiktok.com/v2/auth/authorize/client_key=${process.env.TIKTOK_CLIENT_KEY}&scope=user.info.basic&response_type=code&redirect_uri=${encodeURIComponent(process.env.TIKTOK_REDIRECT_URI)}&state=randomState123`; // randomState should be generated securely
    console.log(tiktokAuthUrl);
    
    res.redirect(tiktokAuthUrl);
  }

  
  // @Get('callback')
  // async handleTikTokCallback(@Query('code') code: string, @Res() res: Response) {
  //   console.log('ak mainc shgehikvant!!');
    
  //   if (!code) {
  //     return res.status(HttpStatus.BAD_REQUEST).send('Authorization code is missing');
  //   }

  //   try {
     
  //     const tokenData = await this.tiktokService.fetchAccessToken(code);

  //     return res.status(HttpStatus.OK).json(tokenData);
  //   } catch (error) {
  //     return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Failed to authenticate with TikTok', error });
  //   }
  // }

  @Get('callback')
  async handleTikTokCallback(@Query('code') code: string, @Res() res: Response) {
    console.log('Callback function triggered!');
    console.log('Authorization code received:', code);
  
    if (!code) {
      return res.status(HttpStatus.BAD_REQUEST).send('Authorization code is missing');
    }
  
    try {
      const tokenData = await this.tiktokService.fetchAccessToken(code);
      return res.status(HttpStatus.OK).json(tokenData);
    } catch (error) {
      console.error('Error during TikTok authentication:', error);
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Failed to authenticate with TikTok', error });
    }
  }
  
  // @Post('refresh')
  // async refreshAccessToken(@Body('refreshToken') refreshToken: string) {
  //   return await this.tiktokService.refreshAccessToken(refreshToken);
  // }


  // @Post('revoke')
  // async revokeAccessToken(@Body('token') token: string) {
  //   return await this.tiktokService.revokeAccess(token);
  // }
}

