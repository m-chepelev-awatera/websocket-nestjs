import { AccessTokenRepository } from '@users/db/repositories/access-token-repository';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ValidateTokenGuard implements CanActivate {
  constructor(private accessTokenRepository: AccessTokenRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenId = request.headers.authorization;

    const accessToken = await this.accessTokenRepository.findById(tokenId);

    if (!accessToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const { isValid, userId } = await accessToken.checkValidity();

    if (!isValid) {
      throw new UnauthorizedException('Unauthorized');
    }

    request.headers.currentUserId = userId;

    return true;
  }
}
