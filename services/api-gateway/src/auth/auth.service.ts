import { Injectable, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { AUTH_MESSAGES, CreateUserDto } from '@pointflow/contracts'
import { User } from '@pointflow/types'
import { Observable } from 'rxjs'

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  register(dto: CreateUserDto): Observable<User> {
    return this.client.send(AUTH_MESSAGES.USER.CREATE, dto)
  }

  findByEmail({ email, tenantId }: { email: string; tenantId: string }): Observable<User | null> {
    return this.client.send(AUTH_MESSAGES.USER.FIND_BY_EMAIL, { email, tenantId })
  }

  pingAuth(): Observable<string> {
    return this.client.send(AUTH_MESSAGES.INTERNAL.PING, { message: 'Hello from Gateway!' })
  }
}
