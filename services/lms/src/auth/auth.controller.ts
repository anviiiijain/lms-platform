import { Controller } from "@nestjs/common"
import { MessagePattern } from "@nestjs/microservices"
import  { AuthService } from "./auth.service"
import { RegisterDto, LoginDto } from '@lms-monorepo/shared';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @MessagePattern({ cmd: "auth.register" })
register(data: { dto: RegisterDto }) {
  return this.auth.register(data.dto)  
}

  @MessagePattern({ cmd: "auth.login" })
  login(data: {dto: LoginDto}) {
    return this.auth.login(data.dto)
  }
}
