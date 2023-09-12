import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserRepository } from 'src/common/repos/user.repo';
import { decodeAuthToken } from 'src/common/utils/token-generator';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ) {}

  async use(req: Request | any, res: Response, next: NextFunction) {
    try {
      console.log('AuthMiddleware', req.headers);
      const token = req.cookies._digi_auth_token;
      if (!token) {
        throw new UnauthorizedException('Missing auth token');
      }
      const decodedData: any = decodeAuthToken(token);
      const user = await this.userDB.findOneById(decodedData.id);
      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }
      user.hashedPassword = undefined;
      req.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
