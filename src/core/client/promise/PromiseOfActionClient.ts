import {ApiClientApi} from '../ApiClient'
import {PromiseOfAction} from './PromiseOfAction'
import {Id} from '../../model'

export class PromiseOfActionClient {
  constructor(private client: ApiClientApi) {}

  readonly list = () => {
    return this.client.get<PromiseOfAction[]>(`/promises`).then(l => l.map(p => PromiseOfActionClient.mapPromiseOfAction(p)))
  }

  readonly check = (promiseId: Id) => {
    return this.client.post<void>(`/promises/${promiseId}/check`)
  }

  readonly uncheck = (promiseId: Id) => {
    return this.client.post<void>(`/promises/${promiseId}/uncheck`)
  }

  static readonly mapPromiseOfAction = (_: {[key in keyof PromiseOfAction]: any}): PromiseOfAction => ({
    ..._,
    expirationDate: new Date(new Date(_.expirationDate).toDateString()),
    resolutionDate: _.resolutionDate ? new Date(new Date(_.resolutionDate).toDateString()) : undefined,
  })
}
