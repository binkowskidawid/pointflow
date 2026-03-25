import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AUTH_MESSAGES, CreateUserDto, LoginDto, LoginResponseDto } from '@pointflow/contracts'
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

  @MessagePattern(AUTH_MESSAGES.USER.LOGIN)
  async login(@Payload() data: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(data)
  }

  @MessagePattern(AUTH_MESSAGES.USER.REFRESH)
  async refresh(@Payload() data: { refreshToken: string }): Promise<LoginResponseDto> {
    return this.authService.refresh(data.refreshToken)
  }

  @MessagePattern(AUTH_MESSAGES.USER.LOGOUT)
  async logout(@Payload() data: { refreshToken: string }): Promise<void> {
    return this.authService.logout(data.refreshToken)
  }
}
