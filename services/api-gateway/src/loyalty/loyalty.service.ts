import { Injectable, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { CreateVisitDto } from '@pointflow/contracts'
import { Visit } from '@pointflow/types'
import { Observable } from 'rxjs'

@Injectable()
export class LoyaltyService {
  constructor(@Inject('LOYALTY_SERVICE') private client: ClientProxy) {}

  createVisit(dto: CreateVisitDto): Observable<Visit> {
    return this.client.send({ cmd: 'create_visit' }, dto)
  }

  getAllVisits(tenantId: string): Observable<Visit[]> {
    return this.client.send({ cmd: 'get_all_visits' }, { tenantId })
  }

  getVisitsByCardId(cardId: string, tenantId: string): Observable<Visit[]> {
    return this.client.send({ cmd: 'get_visits_by_card_id' }, { cardId, tenantId })
  }

  pingLoyalty(): Observable<string> {
    return this.client.send({ cmd: 'ping' }, { message: 'Hello from Gateway!' })
  }
}
