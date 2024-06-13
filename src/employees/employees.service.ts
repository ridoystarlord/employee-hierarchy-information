import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { HashedPassword } from '../utils/Password';

import { CreateEmployeeDto } from './dto/create-employee.dto';

interface EmployeeWithChildren {
  id: number;
  name: string;
  username: string;
  positionName: string;
  parentId: number;
  createdAt: Date;
  updatedAt: Date;
  children: EmployeeWithChildren[];
}

@Injectable()
export class EmployeesService {
  constructor(private database: DatabaseService) {}

  async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const hashedPassword = await HashedPassword(createEmployeeDto.password);
    await this.database.employee.create({
      data: {
        ...createEmployeeDto,
        password: hashedPassword,
      },
    });
  }

  async getEmployeeList() {
    const employees = await this.database.employee.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        positionName: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return employees;
  }

  async getEmployeeWithChildren(
    employeeId: number,
  ): Promise<EmployeeWithChildren | null> {
    const employee = await this.database.employee.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        name: true,
        username: true,
        positionName: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        children: true,
      },
    });

    if (!employee) return null;

    const result: EmployeeWithChildren = {
      ...employee,
      children: [],
    };

    for (const child of employee.children) {
      const childWithChildren = await this.getEmployeeWithChildren(child.id);
      if (childWithChildren) {
        result.children.push(childWithChildren);
      }
    }

    return result;
  }
}
