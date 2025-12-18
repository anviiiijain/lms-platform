import { Controller } from "@nestjs/common"
import { MessagePattern } from "@nestjs/microservices"
import { UsersService } from "./users.service"

@Controller()
export class UsersController {
  constructor(private users: UsersService) {}

  @MessagePattern({ cmd: "users.getStats" })
  getStats(data: { userId: string }) {
    return this.users.getStats(data.userId)
  }

  @MessagePattern({ cmd: "users.getProfile" })
  getProfile(data: { userId: string }) {
    return this.users.getProfile(data.userId)
  }

  @MessagePattern({ cmd: "users.getRecentActivity" })
  getRecentActivity(data: { userId: string; limit?: number }) {
    return this.users.getRecentActivity(data.userId, data.limit)
  }
}
