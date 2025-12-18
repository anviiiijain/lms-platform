import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>("JWT_SECRET")
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables")
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    })
  }

  async validate(payload: any) {
    // Payload validation - ensure required fields exist
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException("Invalid token payload")
    }

    return { userId: payload.sub, email: payload.email }
  }
}
