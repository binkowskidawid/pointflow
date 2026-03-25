import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { firstValueFrom, Observable } from 'rxjs'
import { CreateUserDto, LoginDto, LoginResponseDto } from '@pointflow/contracts'
import type { User } from '@pointflow/types'
import type { Request, Response } from 'express'
import { Public } from './public.decorator'

type PublicLoginResponse = Omit<LoginResponseDto, 'refreshToken'>
type RequestWithUser = Request & {
  user: LoginResponseDto['user']
}

const REFRESH_COOKIE_NAME = 'pointflow_refresh_token'
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
const REFRESH_COOKIE_PATH = '/api/v1/auth'

function parseCookie(headerValue: string | undefined, cookieName: string): string | null {
  if (!headerValue) {
    return null
  }

  const match = headerValue
    .split(';')
    .map((pair) => pair.trim())
    .find((pair) => pair.startsWith(`${cookieName}=`))

  if (!match) {
    return null
  }

  return decodeURIComponent(match.slice(cookieName.length + 1))
}

function buildRefreshCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: REFRESH_COOKIE_PATH,
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
  }
}

function buildRefreshCookieClearOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: REFRESH_COOKIE_PATH,
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserDto): Promise<User> {
    return await firstValueFrom(this.authService.register(dto))
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<PublicLoginResponse> {
    const session = await firstValueFrom(this.authService.login(dto))
    this.setRefreshTokenCookie(response, session.refreshToken)
    return this.toPublicLoginResponse(session)
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<PublicLoginResponse> {
    const refreshToken = this.readRefreshToken(request)

    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token')
    }

    const session = await firstValueFrom(this.authService.refresh(refreshToken))
    this.setRefreshTokenCookie(response, session.refreshToken)
    return this.toPublicLoginResponse(session)
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const refreshToken = this.readRefreshToken(request)

    if (refreshToken) {
      await firstValueFrom(this.authService.logout(refreshToken))
    }

    this.clearRefreshTokenCookie(response)
  }

  @Get('me')
  me(@Req() request: RequestWithUser): LoginResponseDto['user'] {
    return request.user
  }

  @Get('ping')
  @Public()
  pingAuthService(): Observable<string> {
    return this.authService.pingAuth()
  }

  private readRefreshToken(request: Request): string | null {
    return parseCookie(request.headers.cookie, REFRESH_COOKIE_NAME)
  }

  private setRefreshTokenCookie(response: Response, refreshToken: string): void {
    response.cookie(REFRESH_COOKIE_NAME, refreshToken, buildRefreshCookieOptions())
  }

  private clearRefreshTokenCookie(response: Response): void {
    response.clearCookie(REFRESH_COOKIE_NAME, buildRefreshCookieClearOptions())
  }

  private toPublicLoginResponse(session: LoginResponseDto): PublicLoginResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken, ...publicSession } = session
    return publicSession
  }
}
