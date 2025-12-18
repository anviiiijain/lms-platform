import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(@Inject('LMS_SERVICE') private lmsClient: ClientProxy) {}

  @Get('me/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return firstValueFrom(
      this.lmsClient.send({ cmd: 'users.getProfile' }, { userId: req.user.userId }),
    );
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req) {
    return firstValueFrom(
      this.lmsClient.send({ cmd: 'users.getStats' }, { userId: req.user.userId }),
    );
  }

  @Get('me/activity')
  @UseGuards(JwtAuthGuard)
  async getRecentActivity(@Request() req, @Query('limit') limit?: string) {
    return firstValueFrom(
      this.lmsClient.send(
        { cmd: 'users.getRecentActivity' },
        { userId: req.user.userId, limit: limit ? parseInt(limit) : 10 },
      ),
    );
  }
}