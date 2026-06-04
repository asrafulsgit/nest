import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token =
      request.signedCookies?.['access_token'] ??
      request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const jwtSecret = this.configService.get<string>('app.jwtAccessTokenSercret');
      const decoded = this.jwtService.verify(token, { secret: jwtSecret });
      request.user = decoded;    
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}