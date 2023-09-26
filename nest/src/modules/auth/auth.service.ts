import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { User } from 'src/common/schemas/user.schema';
import { SafeUser } from 'src/common/types';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  generateAuthToken(id: string) {
    const jwtSecret = this.configService.get('jwt.secret');
    if (!jwtSecret) {
      throw new Error('JWT Secret is missing!');
    }
    return jwt.sign({ id }, jwtSecret, {
      expiresIn: '30d',
    });
  }

  async register(body: RegisterUserDto): Promise<User> {
    const { email, name, password } = body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userService.createUser({
      email,
      name,
      hashedPassword: hashedPassword,
    });

    return user;
  }

  async getCurrentUser(req: Request): Promise<{
    status: string;
    result: {
      user: SafeUser;
    };
  }> {
    try {
      const token = req.cookies['Authentication'];

      console.log('Token from Authentication cookie:', token);

      console.log('JWT Secret:', this.configService.get('jwt.secret'));

      const decodedToken = jwt.verify(
        token,
        this.configService.get('jwt.secret'),
      ) as JwtPayload & { id: string };

      console.log('Decoded token:', decodedToken);

      const user = await this.userService.getUserById(decodedToken.id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        status: 'success',
        result: {
          user: {
            ...user.toObject(),
          },
        },
      };
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async loginWithGoogle(googleToken: string): Promise<User> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const user = await this.userService.getUserByEmail(payload.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async loginWithEmail(credentials: {
    email: string;
    password: string;
  }): Promise<{
    status: string;
    message: string;
    result: { user: User; token: string };
  }> {
    try {
      const user = await this.userService.getUserByEmail(credentials.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!(await bcrypt.compare(credentials.password, user.hashedPassword))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = await this.generateAuthToken(user._id);

      return {
        status: 'success',
        message: 'User logged in successfully',
        result: {
          token: token,
          user: user,
        },
      };
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async logout(req: Request, res: Response): Promise<{ status: string }> {
    try {
      res.clearCookie('Authentication');

      return { status: 'logged out' };
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
