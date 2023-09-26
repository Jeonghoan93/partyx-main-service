import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/common/repos/user.repo';
import { sendEmail } from 'src/common/utils/mail-handler';
import { generateHashPassword } from 'src/common/utils/password-manager';

const config = new ConfigService();

@Injectable()
export class EmailVerificationService {
  constructor(
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ) {}
  async sendEmail(createUserDto: any) {
    try {
      // user is already exist
      const user = await this.userDB.findOneByEmail(createUserDto.email);
      if (user) {
        throw new Error('User already exist');
      }

      // generate the otp
      const otp = Math.floor(Math.random() * 900000) + 100000;

      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);

      const newUser = await this.userDB.create({
        ...createUserDto,
        otp,
        otpExpiryTime,
      });

      sendEmail(
        user.email,
        config.get('emailService.emailTemplates.verifyEmail'),
        'Email verification - partyx',
        {
          customerName: user.name,
          customerEmail: user.email,
          otp,
        },
      );

      return {
        success: true,
        message:
          'Please activate your account by verifying your email. We have sent you a email with the otp',
        result: { email: newUser.email },
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(otp: number, email: string) {
    try {
      const user = await this.userDB.findOneByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      if (user.verfication.otp !== otp) {
        throw new Error('Invalid otp');
      }
      if (user.verfication.otpExpiryTime < new Date()) {
        throw new Error('Otp expired');
      }

      await this.userDB.updateOneByEmail(email, {
        isEmailVerified: true,
      });

      return {
        success: true,
        message: 'Email verified successfully. you can login now',
      };
    } catch (error) {
      throw error;
    }
  }

  async sendOtpEmail(email: string) {
    try {
      const user = await this.userDB.findOneByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      if (user.isEmailVerified) {
        throw new Error('Email already verified');
      }
      const otp = Math.floor(Math.random() * 900000) + 100000;

      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);

      await this.userDB.updateOneByEmail(email, {
        verfication: {
          otp,
          otpExpiryTime,
        },
      });

      sendEmail(
        user.email,
        config.get('emailService.emailTemplates.verifyEmail'),
        'Email verification - partyx',
        {
          customerName: user.name,
          customerEmail: user.email,
          otp,
        },
      );

      return {
        success: true,
        message: 'Otp sent successfully',
        result: { email: user.email },
      };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userDB.findOneByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      let password = Math.random().toString(36).substring(2, 12);
      const tempPassword = password;
      password = await generateHashPassword(password);
      await this.userDB.updateOneById(
        {
          _id: user._id,
        },
        {
          hashedPassword: password,
        },
      );

      sendEmail(
        user.email,
        config.get('emailService.emailTemplates.forgotPassword'),
        'Forgot password - partyx',
        {
          customerName: user.name,
          customerEmail: user.email,
          newPassword: password,
          loginLink: config.get('loginLink'),
        },
      );

      return {
        success: true,
        message: 'Password sent to your email',
        result: { email: user.email, password: tempPassword },
      };
    } catch (error) {
      throw error;
    }
  }
}
