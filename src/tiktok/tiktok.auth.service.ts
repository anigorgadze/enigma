import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class TikTokAuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.clientId = this.configService.get(process.env.TIKTOK_CLIENT_KEY);
    this.clientSecret = this.configService.get(process.env.TIKTOK_CLIENT_SECRET);
    this.redirectUri = this.configService.get(process.env.TIKTOK_REDIRECT_URI);
  }


  getAuthorizationUrl(): string {
    const scope = 'user.info.basic,video.list';
    const state = 'your_random_state'; 
    return `https://www.tiktok.com/v2/auth/authorize/?client_key=${this.clientId}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(
      this.redirectUri,
    )}&state=${state}`;
  }


// async exchangeCodeForAccessToken(code: string): Promise<any> {
//     const url = 'https://open-api.tiktok.com/oauth/access_token/';
//     const params = {
//       client_key: this.clientId,
//       client_secret: this.clientSecret,
//       code,
//       grant_type: 'authorization_code',
//       redirect_uri: this.redirectUri,
//     };
  
//     try {
     
//       const response = await firstValueFrom(
//         this.httpService.post(url, params, {
//           headers: { 'Content-Type': 'application/json' },
//         }),
//       );

//       const { access_token, refresh_token, expires_in } = response.data;
     
//       const expiresAt = Date.now() + expires_in * 1000; 
    
//       const tokenData = {
//         accessToken: access_token,
//         refreshToken: refresh_token,
//         expiresAt,
//       };
  
//       return tokenData; // Return the token data along with the expiration time
  
//     } catch (error) {
//       console.error('Error fetching access token:', error.response?.data);
//       throw new HttpException('Failed to fetch access token', HttpStatus.BAD_REQUEST);
//     }
//   }
  

  // Step 3: Refresh the access token


  // async refreshAccessToken(refreshToken: string): Promise<any> {
  //   const url = 'https://open-api.tiktok.com/oauth/refresh_token/';
  //   const params = {
  //     client_key: this.clientId,
  //     client_secret: this.clientSecret,
  //     refresh_token: refreshToken,
  //     grant_type: 'refresh_token',
  //   };

  //   const response = await lastValueFrom(
  //     this.httpService.post(url, params),
  //   );
  //   return response.data;
  // }
}
