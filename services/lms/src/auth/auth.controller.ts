import { Controller } from "@nestjs/common"
import { MessagePattern } from "@nestjs/microservices"
import  { AuthService } from "./auth.service"
import type { RegisterDto } from "./dto/register.dto"
import type { LoginDto } from "./dto/login.dto"

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @MessagePattern({ cmd: "auth.register" })
register(data: { dto: RegisterDto }) {
  return this.auth.register(data.dto)  
}

  @MessagePattern({ cmd: "auth.login" })
  login(dto: LoginDto) {
    return this.auth.login(dto)
  }
}
