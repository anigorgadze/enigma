import { HttpService } from '@nestjs/axios';
import { Injectable,  HttpException, HttpStatus } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TikTokService {
  private readonly clientKey = process.env.TIKTOK_CLIENT_KEY; 
  private readonly clientSecret = process.env.TIKTOK_CLIENT_SECRET; 
  private readonly redirectUri = process.env.TIKTOK_REDIRECT_URI;

  constructor(private readonly httpService: HttpService) {}

  async fetchAccessToken(code: string) {
    const url = 'https://open.tiktokapis.com/v2/oauth/token/';

    const body = new URLSearchParams({
      client_key: this.clientKey,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
    }).toString();

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, body, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Failed to fetch access token',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const url = 'https://open.tiktokapis.com/v2/oauth/token/';

    const body = new URLSearchParams({
      client_key: this.clientKey,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString();

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, body, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Failed to refresh access token',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async revokeAccess(token: string) {
    const url = 'https://open.tiktokapis.com/v2/oauth/revoke/';

    const body = new URLSearchParams({
      client_key: this.clientKey,
      client_secret: this.clientSecret,
      token,
    }).toString();

    try {
      await lastValueFrom(
        this.httpService.post(url, body, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      );

      return { message: 'Access revoked successfully' };
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Failed to revoke access',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}

