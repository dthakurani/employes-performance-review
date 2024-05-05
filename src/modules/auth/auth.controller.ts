import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonHelper } from '../common/common.helper';
import { AuthGuard } from '../guards/auth.guard';
import { Request, Response } from 'express';

@ApiBearerAuth('Bearer')
@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commonHelper: CommonHelper,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: UserLoginDto,
  ) {
    try {
      const deviceAddress = req.headers['user-agent'] || '';
      const data = await this.authService.login(deviceAddress, body);

      return this.commonHelper.apiResponseHandler({
        res,
        data,
        message: 'User logged in successfully',
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error('user login error :\n', new Date().toISOString(), error);
      }

      return this.commonHelper.apiErrorHandler({
        req,
        res,
        error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('access-token')
  @ApiOperation({ summary: 'Get access token' })
  async getAccessToken(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken =
        req.headers?.authorization?.replace('Bearer ', '') || '';
      const data = await this.authService.getAccessToken(refreshToken);

      return this.commonHelper.apiResponseHandler({
        res,
        data,
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'user getAccessToken error :\n',
          new Date().toISOString(),
          error,
        );
      }

      return this.commonHelper.apiErrorHandler({
        req,
        res,
        error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken =
        req.headers?.authorization?.replace('Bearer ', '') || '';
      const data = await this.authService.logout(refreshToken);

      return this.commonHelper.apiResponseHandler({
        res,
        data: {},
        message: 'User logged out successfully',
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error('user logout error :\n', new Date().toISOString(), error);
      }

      return this.commonHelper.apiErrorHandler({
        req,
        res,
        error,
      });
    }
  }
}
