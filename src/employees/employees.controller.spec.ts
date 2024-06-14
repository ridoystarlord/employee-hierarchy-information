import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';

import { JwtAuthGuard } from '../auth/guard/jwt.guard';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let service: EmployeesService;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    mockResponse = {
      json: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: {
            createEmployee: jest.fn(),
            getEmployeeList: jest.fn(),
            getEmployeeWithChildren: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<EmployeesController>(EmployeesController);
    service = module.get<EmployeesService>(EmployeesService);
  });

  describe('GetEmployeeProfile', () => {
    it('should retrieve employee profile', () => {
      const mockRequest = {} as Request;
      controller.GetEmployeeProfile(mockRequest, mockResponse as Response);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Employee Profile Retrieved Successfully',
        data: mockRequest.user,
      });
    });
  });

  describe('CreateEmployee', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'New Employee',
        username: 'newuser',
        password: 'password123',
        positionName: 'Developer',
        parentId: null,
      };

      await controller.CreateEmployee(
        {} as Request,
        mockResponse as Response,
        createEmployeeDto,
      );
      expect(service.createEmployee).toHaveBeenCalledWith(createEmployeeDto);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Employee Added Successfully',
      });
    });
  });

  describe('GetEmployeeHierarchy', () => {
    it('should retrieve employee hierarchy', async () => {
      const mockHierarchy = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        positionName: 'Manager',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        children: [],
      };

      jest
        .spyOn(service, 'getEmployeeWithChildren')
        .mockResolvedValue(mockHierarchy);

      await controller.GetEmployeeHierarchy(
        {} as Request,
        mockResponse as Response,
        1,
      );
      expect(service.getEmployeeWithChildren).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Employee Hierarchy Retrieved Successfully',
        data: mockHierarchy,
      });
    });
  });

  describe('GetEmployeeList', () => {
    it('should retrieve employee list', async () => {
      const mockEmployeeList = [
        {
          id: 1,
          name: 'Employee One',
          username: 'employee1',
          positionName: 'Developer',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(service, 'getEmployeeList')
        .mockResolvedValue(mockEmployeeList);

      await controller.GetEmployeeList({} as Request, mockResponse as Response);
      expect(service.getEmployeeList).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Employee List Retrieved Successfully',
        data: mockEmployeeList,
      });
    });
  });
});
