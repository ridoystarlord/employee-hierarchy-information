import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import APIResponse from '../utils/apiResponse';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Req() req, @Res() res) {
    const token = await this.authService.login(req.user);
    APIResponse(res, {
      success: true,
      message: 'Login Successfully',
      data: token,
    });
  }
}
