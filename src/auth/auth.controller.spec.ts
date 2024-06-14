import { Test, TestingModule } from '@nestjs/testing';

import APIResponse from '../utils/apiResponse';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ token: 'mockToken' }),
  };

  const mockApiResponse = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideProvider(APIResponse)
      .useValue(mockApiResponse)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token', async () => {
      const req = {
        user: { username: 'testUser', id: 1 },
      };

      const res = {
        json: jest.fn(),
      };

      await authController.signIn(req, res);

      expect(authService.login).toHaveBeenCalledWith(req.user);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login Successfully',
        data: { token: 'mockToken' },
      });
    });
  });
});
