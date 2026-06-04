import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private config: ConfigService) {}

  setAccessToken(res: Response, token: string) {
    const accessToken = this.config.get('cookie.accessToken');
    res.cookie(accessToken.name, token, accessToken.options);
  }

  setRefreshToken(res: Response, token: string) {
    const { name, options } = this.config.get('cookie.refreshToken');
    res.cookie(name, token, options);
  }

  clearTokens(res: Response) {
    const { name: accessName } = this.config.get('cookie.accessToken');
    const { name: refreshName } = this.config.get('cookie.refreshToken');

    res.clearCookie(accessName);
    res.clearCookie(refreshName);
  }
}
