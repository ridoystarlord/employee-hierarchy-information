import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { DatabaseService } from '../database/database.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: DatabaseService,
          useValue: {
            employee: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    databaseService = moduleRef.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateEmployee', () => {
    it('should return employee object when username and password match', async () => {
      const mockEmployee: any = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword', // Assuming IsPasswordMatched will match this
        // Add other properties as needed for your application
      };

      jest
        .spyOn(databaseService.employee, 'findUnique')
        .mockResolvedValue(mockEmployee);

      const result = await authService.validateEmployee(
        'testuser',
        'password123',
      );

      expect(result).toBeDefined();
      expect(result.id).toEqual(mockEmployee.id);
      expect(result.username).toEqual(mockEmployee.username);
      expect(result.password).toBeUndefined(); // Ensure password is not returned
    });

    it('should return null when username or password do not match', async () => {
      jest
        .spyOn(databaseService.employee, 'findUnique')
        .mockResolvedValue(null);

      const result = await authService.validateEmployee(
        'nonexistentuser',
        'password123',
      );

      expect(result).toBeNull();
    });
  });
});
