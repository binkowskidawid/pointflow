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

const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly authRepository: AuthRepository,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
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

    const isStored = await this.tokenRepository.exists(user.id, refreshToken)

    if (!isStored) {
      throw new UnauthorizedException('Refresh token has been revoked')
    }

    await this.tokenRepository.delete(user.id, refreshToken)
    return await this.createSession(user)
  }

  async logout(refreshToken: string): Promise<void> {
    const payload = this.jwtService.decode(refreshToken) as SessionPayload | null

    if (!payload?.sub) {
      return
    }

    await this.tokenRepository.delete(payload.sub, refreshToken)
  }

  private async createSession(user: User): Promise<LoginResponseDto> {
    const payload = this.createSessionPayload(user)
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.getRefreshTokenSecret(),
      expiresIn: REFRESH_TOKEN_EXPIRES_IN as never,
    })

    await this.tokenRepository.storeRefreshToken(user.id, refreshToken, REFRESH_TOKEN_TTL_SECONDS)

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
        secret: this.getRefreshTokenSecret(),
      })
    } catch {
      this.logger.warn('Refresh token verification failed')
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  private getRefreshTokenSecret(): string {
    return process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || ''
  }
}
