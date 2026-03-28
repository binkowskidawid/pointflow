import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { getRequiredEnv } from '@pointflow/utils'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getRequiredEnv('JWT_SECRET', configService.get<string>('JWT_SECRET')),
      algorithms: ['HS256'],
      issuer: 'pointflow-auth',
      audience: 'pointflow-api',
    })
  }

  validate(payload: { sub: string; email: string; tenantId: string; role: string; name?: string }) {
    return {
      id: payload.sub,
      email: payload.email,
      tenantId: payload.tenantId,
      role: payload.role,
      name: payload.name || '',
    }
  }
}
