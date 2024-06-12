import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import APIResponse from '../utils/apiResponse';

import { LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Res() res, @Body() loginDto: LoginDTO) {
    const token = await this.authService.login(loginDto);
    APIResponse(res, {
      success: true,
      message: 'Login Successfully',
      data: token,
    });
  }
}
