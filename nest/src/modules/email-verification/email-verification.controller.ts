import { Controller, Get, HttpStatus, Param, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { EmailVerificationService } from './email-verification.service';

@Controller('api/email-verification')
export class EmailVerificationController {
  constructor(private readonly usersService: EmailVerificationService) {}

  @Get('/verify-email/:otp/:email')
  async verifyEmail(@Param('otp') otp: number, @Param('email') email: string) {
    return await this.usersService.verifyEmail(otp, email);
  }

  @Get('send-otp-email/:email')
  async sendOtpEmail(@Param('email') email: string) {
    return await this.usersService.sendOtpEmail(email);
  }

  @Put('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('_digi_auth_token');
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Logout successfully',
    });
  }

  @Get('forgot-password/:email')
  async forgotPassword(@Param('email') email: string) {
    return await this.usersService.forgotPassword(email);
  }
}
