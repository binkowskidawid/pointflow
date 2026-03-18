import { Inject, Injectable, Logger } from '@nestjs/common'
import { AuthRepository } from './auth.repository'
import { ClientKafka } from '@nestjs/microservices'
import { KAFKA_TOPICS, type CreateUserDto } from '@pointflow/contracts'
import type { User } from '@pointflow/types'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly authRepository: AuthRepository,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
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
}
