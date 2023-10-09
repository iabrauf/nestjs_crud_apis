import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constant/constants';
import { Request } from 'express';


@Injectable()
export class TaskGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private getTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers;
    const token = authHeader && authHeader.authorization?.split(' ')[1];
    return token;
  }
}
