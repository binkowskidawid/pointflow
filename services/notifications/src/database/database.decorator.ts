import { Inject } from '@nestjs/common'

export const InjectDatabase = () => Inject('DB_CONNECTION')
