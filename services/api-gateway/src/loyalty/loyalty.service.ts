import { Injectable, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { CreateVisitDto, LOYALTY_MESSAGES } from '@pointflow/contracts'
import { Visit } from '@pointflow/types'
import { Observable } from 'rxjs'

@Injectable()
export class LoyaltyService {
  constructor(@Inject('LOYALTY_SERVICE') private client: ClientProxy) {}

  createVisit(dto: CreateVisitDto): Observable<Visit> {
    return this.client.send(LOYALTY_MESSAGES.VISIT.CREATE, dto)
  }

  getAllVisits(tenantId: string): Observable<Visit[]> {
    return this.client.send(LOYALTY_MESSAGES.VISIT.GET_ALL, { tenantId })
  }

  getVisitsByCardId(cardId: string, tenantId: string): Observable<Visit[]> {
    return this.client.send(LOYALTY_MESSAGES.VISIT.GET_BY_CARD, { cardId, tenantId })
  }

  pingLoyalty(): Observable<string> {
    return this.client.send(LOYALTY_MESSAGES.INTERNAL.PING, { message: 'Hello from Gateway!' })
  }
}
