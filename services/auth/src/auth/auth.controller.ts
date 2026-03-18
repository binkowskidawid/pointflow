import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AUTH_MESSAGES, CreateUserDto } from '@pointflow/contracts'
import { MessagePattern, Payload } from '@nestjs/microservices'
import type { User } from '@pointflow/types'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_MESSAGES.USER.CREATE)
  async register(@Payload() data: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    return this.authService.register(data)
  }

  @MessagePattern(AUTH_MESSAGES.USER.FIND_BY_EMAIL)
  async findByEmail(@Payload() data: { email: string; tenantId: string }): Promise<User | null> {
    return this.authService.findByEmail(data)
  }

  @MessagePattern(AUTH_MESSAGES.INTERNAL.PING)
  ping() {
    return 'Auth Service is alive! 🛡️'
  }
}
