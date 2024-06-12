import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import APIResponse from '../utils/apiResponse';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request, @Res() res: Response) {
    APIResponse(res, {
      success: true,
      message: 'User Profile Retrieved Successfully',
      data: req.user,
    });
  }
}
