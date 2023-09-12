import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/user/user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockUserService = {
      getUserByEmail: jest.fn(),
    };

    const mockJwtService = {
      verify: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'jwt.secret') {
          return 'someMockSecret';
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  describe('getCurrentUser', () => {
    it('should retrieve the current user from a valid token', async () => {
      const mockReq = {
        cookies: {
          Authentication: 'someValidToken',
        },
      };

      const mockDecodedToken = {
        email: 'test@example.com',
      };

      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
      };

      jwtService.verify.mockReturnValueOnce(mockDecodedToken);
      userService.getUserByEmail.mockResolvedValueOnce(mockUser as any);

      const result = await authService.getCurrentUser(mockReq as any);

      expect(result).toMatchObject({
        status: 'success',
        result: {
          user: mockUser,
        },
      });
    });
  });
});
