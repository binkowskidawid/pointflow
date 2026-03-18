import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common'
import { AuthService } from './auth.service'
import { firstValueFrom, Observable } from 'rxjs'
import { CreateUserDto } from '@pointflow/contracts'
import type { User } from '@pointflow/types'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserDto): Promise<User> {
    return await firstValueFrom(this.authService.register(dto))
  }

  @Get('find-by-email')
  async findByEmail(@Query() query: { email: string; tenantId: string }): Promise<User | null> {
    return await firstValueFrom(this.authService.findByEmail(query))
  }

  @Get('ping')
  pingAuthService(): Observable<string> {
    return this.authService.pingAuth()
  }
}
