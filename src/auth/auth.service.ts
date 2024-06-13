import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { DatabaseService } from '../database/database.service';
import { IsPasswordMatched } from '../utils/Password';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private database: DatabaseService,
  ) {}

  async validateEmployee(username: string, password: string): Promise<any> {
    const employee = await this.database.employee.findUnique({
      where: { username },
    });
    if (employee && IsPasswordMatched(password, employee.password)) {
      delete employee.password;
      return employee;
    }
    return null;
  }

  async login(user): Promise<{ token: string }> {
    return {
      token: this.jwtService.sign(user),
    };
  }
}
