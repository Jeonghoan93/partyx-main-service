import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from 'src/common/schemas/user.schema';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto): Promise<User> {
    try {
      return await this.authService.register(body);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  @Get('current-user')
  @HttpCode(200)
  async getCurrentUser(@Req() req: Request): Promise<any> {
    try {
      return await this.authService.getCurrentUser(req);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  @Post('login-google')
  async loginGoogle(@Body('googleToken') googleToken: string): Promise<User> {
    try {
      return await this.authService.loginWithGoogle(googleToken);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Res() res: Response,
    @Body() credentials: { email: string; password: string },
  ): Promise<void> {
    try {
      const loginResult = await this.authService.loginWithEmail(credentials);

      res.cookie('Authentication', loginResult.result.token, {
        maxAge: 1000 * 60 * 60 * 24,
      });

      res.json(loginResult);
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException(err.message);
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const logoutResponse = await this.authService.logout(req, res);

      return res.json(logoutResponse);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
