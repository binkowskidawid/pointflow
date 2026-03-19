import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { AuthRepository } from './auth.repository'
import { ClientKafka } from '@nestjs/microservices'
import { KAFKA_TOPICS, LoginDto, LoginResponseDto, type CreateUserDto } from '@pointflow/contracts'
import type { User } from '@pointflow/types'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly authRepository: AuthRepository,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
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

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      name: user.name,
    }

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name || '',
        tenantId: user.tenantId,
      },
    }
  }
}
