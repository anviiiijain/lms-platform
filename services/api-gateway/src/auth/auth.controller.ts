import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterDto, LoginDto } from '@lms-monorepo/shared';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('LMS_SERVICE')
    private lmsClient: ClientProxy,
  ) {}

  @Post('register')
async register(@Body() dto: RegisterDto) {
  return firstValueFrom(
    this.lmsClient.send({ cmd: 'auth.register' }, { dto }) 
  );
}

@Post('login')
async login(@Body() dto: LoginDto) {
  return firstValueFrom(
    this.lmsClient.send({ cmd: 'auth.login' }, { dto }) 
  );
}
}