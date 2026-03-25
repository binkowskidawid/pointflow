import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { AuthRepository } from './auth.repository'
import { ClientKafka } from '@nestjs/microservices'
import { type CreateUserDto, KAFKA_TOPICS, LoginDto, LoginResponseDto } from '@pointflow/contracts'
import type { User } from '@pointflow/types'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { TokenRepository } from '../token/token.repository'

type SessionPayload = {
  sub: string
  email: string
  role: string
  tenantId: string
  name?: string | null
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly authRepository: AuthRepository,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    @Inject('AUTH_REFRESH_SECRET') private readonly refreshTokenSecret: string,
    @Inject('AUTH_REFRESH_TOKEN_TTL_SECONDS') private readonly refreshTokenTtlSeconds: number,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect()
  }

  async register(data: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const hash = await bcrypt.hash(data.password, 10)

    const registeredUser = await this.authRepository.register({
      ...data,
      passwordHash: hash,
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = registeredUser

    this.kafkaClient.emit(KAFKA_TOPICS.USER_CREATED, userWithoutPassword)

    return userWithoutPassword
  }

  async findByEmail({
    email,
    tenantId,
  }: {
    email: string
    tenantId: string
  }): Promise<User | null> {
    return this.authRepository.findByEmail({ email, tenantId })
  }

  async login(data: LoginDto): Promise<LoginResponseDto> {
    const user = await this.authRepository.findByEmail({
      email: data.email,
      tenantId: data.tenantId,
    })

    if (!user) throw new UnauthorizedException('Invalid credentials')

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash)

    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials')

    return await this.createSession(user)
  }

  async refresh(refreshToken: string): Promise<LoginResponseDto> {
    const payload = this.verifyRefreshToken(refreshToken)
    const user = await this.authRepository.findById(payload.sub)

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const wasValid = await this.tokenRepository.getAndDelete(user.id, refreshToken)

    if (!wasValid) {
      throw new UnauthorizedException('Refresh token has been revoked')
    }

    return await this.createSession(user)
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = this.verifyRefreshToken(refreshToken)
      await this.tokenRepository.delete(payload.sub, refreshToken)
    } catch {
      // Invalid/expired token — logout is best-effort, silently discard
    }
  }

  private async createSession(user: User): Promise<LoginResponseDto> {
    const payload = this.createSessionPayload(user)
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenTtlSeconds,
    })

    await this.tokenRepository.storeRefreshToken(user.id, refreshToken, this.refreshTokenTtlSeconds)

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken,
      user: this.toLoginUser(user),
    }
  }

  private createSessionPayload(user: User): SessionPayload {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      name: user.name,
    }
  }

  private toLoginUser(user: User): LoginResponseDto['user'] {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || '',
      tenantId: user.tenantId,
    }
  }

  private verifyRefreshToken(refreshToken: string): SessionPayload {
    try {
      return this.jwtService.verify<SessionPayload>(refreshToken, {
        secret: this.refreshTokenSecret,
      })
    } catch {
      this.logger.warn('Refresh token verification failed')
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
