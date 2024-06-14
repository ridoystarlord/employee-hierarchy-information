import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { DatabaseService } from '../database/database.service';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';

jest.mock('bcrypt');

describe('EmployeesService', () => {
  let service: EmployeesService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    employee: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEmployee', () => {
    it('should hash the password and create an employee', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        positionName: 'Developer',
        parentId: 1,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      await service.createEmployee(createEmployeeDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createEmployeeDto.password, 10);
      expect(databaseService.employee.create).toHaveBeenCalledWith({
        data: {
          ...createEmployeeDto,
          password: 'hashedPassword',
        },
      });
    });
  });

  describe('getEmployeeList', () => {
    it('should return a list of employees', async () => {
      const employees = [
        {
          id: 1,
          name: 'John Doe',
          username: 'johndoe',
          positionName: 'Developer',
          parentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockDatabaseService.employee.findMany.mockResolvedValue(employees);

      const result = await service.getEmployeeList();
      expect(result).toEqual(employees);
    });
  });

  describe('getEmployeeWithChildren', () => {
    it('should return an employee with children', async () => {
      const employee = {
        id: 1,
        name: `John Doe ${new Date().getTime()}`,
        username: `johndoe${new Date().getTime()}`,
        positionName: 'Developer',
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        children: [],
      };
      mockDatabaseService.employee.findUnique.mockResolvedValue(employee);

      const result = await service.getEmployeeWithChildren(1);
      expect(result).toEqual({ ...employee, children: [] });
    });

    it('should return null if employee not found', async () => {
      mockDatabaseService.employee.findUnique.mockResolvedValue(null);

      const result = await service.getEmployeeWithChildren(1);
      expect(result).toBeNull();
    });
  });
});
