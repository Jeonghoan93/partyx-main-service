import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      getCurrentUser: jest.fn(),
      loginWithGoogle: jest.fn(),
      loginWithEmail: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register', async () => {
      const userDto: RegisterUserDto = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      };

      authService.register.mockResolvedValueOnce(userDto as any);

      const result = await authController.register(userDto);

      expect(result).toEqual(userDto);
    });

    it('should throw an UnauthorizedException when registration fails', async () => {
      //TODO: later
    });
  });

  describe.only('getCurrentUser', () => {
    it('should return the current user', async () => {
      const mockUser: any = {
        email: 'test@test.com',
        name: 'Test User',
      };

      authService.getCurrentUser.mockResolvedValue({
        status: 'success',
        result: {
          user: mockUser,
        },
      });

      const mockReq: Partial<Request> = {
        cookies: {
          Authentication: 'someToken',
        },
      };

      const result = await authController.getCurrentUser(mockReq as Request);

      expect(result).toEqual({
        status: 'success',
        result: {
          user: mockUser,
        },
      });
    });

    it('should throw an UnauthorizedException when fetching current user fails', async () => {
      // TODO: later
    });
  });

  describe('loginGoogle', () => {
    it('should login with Google and return a user', async () => {
      // TODO: later
    });

    it('should throw an UnauthorizedException when Google login fails', async () => {
      // TODO: later
    });
  });

  describe('login', () => {
    it('should login with email and password', async () => {
      const result = await authController.login(null, {
        email: 'test@example.com',
        password: 'password',
      });

      console.log(result);
    });

    it('should throw an UnauthorizedException when login fails', async () => {
      authService.loginWithEmail = jest
        .fn()
        .mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        authController.login(null, {
          email: 'test@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrowError('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should logout and clear the authentication cookie', async () => {
      // TODO: later
    });
  });
});
