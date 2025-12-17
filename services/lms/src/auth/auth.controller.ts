import { Controller } from "@nestjs/common"
import { MessagePattern } from "@nestjs/microservices"
import type { AuthService } from "./auth.service"
import type { RegisterDto } from "./dto/register.dto"
import type { LoginDto } from "./dto/login.dto"

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @MessagePattern({ cmd: "auth.register" })
  register(dto: RegisterDto) {
    return this.auth.register(dto)
  }

  @MessagePattern({ cmd: "auth.login" })
  login(dto: LoginDto) {
    return this.auth.login(dto)
  }
}
