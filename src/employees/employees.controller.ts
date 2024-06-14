import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import APIResponse from '../utils/apiResponse';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  GetEmployeeProfile(@Req() req: Request, @Res() res: Response) {
    APIResponse(res, {
      success: true,
      message: 'Employee Profile Retrieved Successfully',
      data: req.user,
    });
  }

  @Post()
  async CreateEmployee(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    await this.employeesService.createEmployee(createEmployeeDto);
    APIResponse(res, {
      success: true,
      message: 'Employee Added Successfully',
    });
  }

  @Get('hierarchy/:id')
  async GetEmployeeHierarchy(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.employeesService.getEmployeeWithChildren(id);
    APIResponse(res, {
      success: true,
      message: 'Employee Hierarchy Retrieved Successfully',
      data: data,
    });
  }
  @Get('')
  async GetEmployeeList(@Req() req: Request, @Res() res: Response) {
    const data = await this.employeesService.getEmployeeList();
    APIResponse(res, {
      success: true,
      message: 'Employee List Retrieved Successfully',
      data: data,
    });
  }
}
