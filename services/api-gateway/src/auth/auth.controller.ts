import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { firstValueFrom, Observable } from 'rxjs'
import { CreateUserDto, LoginDto, LoginResponseDto, UserRole } from '@pointflow/contracts'
import type { User } from '@pointflow/types'
import { parseExpiryToSeconds } from '@pointflow/utils'
import type { Request, Response } from 'express'
import { Public } from './public.decorator'
import { Roles } from './roles.decorator'
import { RolesGuard } from './roles.guard'

type PublicLoginResponse = Omit<LoginResponseDto, 'refreshToken'>
type RequestWithUser = Request & {
  user: LoginResponseDto['user']
}

const REFRESH_COOKIE_NAME = 'pointflow_refresh_token'
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

function buildRefreshCookieOptions(maxAgeMs: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: REFRESH_COOKIE_PATH,
    maxAge: maxAgeMs,
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
  private readonly refreshCookieMaxAgeMs: number

  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    const expiresIn = configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d')
    this.refreshCookieMaxAgeMs = parseExpiryToSeconds(expiresIn) * 1_000
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.SYSTEM_ADMIN)
  async register(@Body() dto: CreateUserDto, @Req() req: RequestWithUser): Promise<User> {
    const callerRole = req.user.role as UserRole

    // Tenant isolation — only SYSTEM_ADMIN may create staff across tenants
    if (callerRole !== UserRole.SYSTEM_ADMIN && req.user.tenantId !== dto.tenantId) {
      throw new ForbiddenException('Cannot create staff in a different tenant')
    }

    // Role hierarchy — MANAGER cannot create OWNER
    if (callerRole === UserRole.MANAGER && dto.role === UserRole.OWNER) {
      throw new ForbiddenException('MANAGER cannot create an OWNER account')
    }

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
      await firstValueFrom(this.authService.logout(refreshToken), {
        defaultValue: undefined,
      })
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
    response.cookie(
      REFRESH_COOKIE_NAME,
      refreshToken,
      buildRefreshCookieOptions(this.refreshCookieMaxAgeMs),
    )
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
