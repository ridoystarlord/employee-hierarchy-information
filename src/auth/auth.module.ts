import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '../database/database.module';
import { EmployeesModule } from '../employees/employees.module';

import { JWT_CONSTANTS } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_CONSTANTS.secret,
      signOptions: { expiresIn: JWT_CONSTANTS.expiresIn },
    }),
    EmployeesModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
