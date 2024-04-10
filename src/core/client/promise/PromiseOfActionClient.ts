import {ApiClientApi} from '../ApiClient'
import {PromiseOfAction} from './PromiseOfAction'
import {Id} from '../../model'

export class PromiseOfActionClient {
  constructor(private client: ApiClientApi) {}

  readonly list = () => {
    return this.client.get<PromiseOfAction[]>(`/promises`).then(l => l.map(p => PromiseOfActionClient.mapPromiseOfAction(p)))
  }

  readonly honour = (promiseId: Id) => {
    return this.client.post<void>(`/promises/${promiseId}/honour`)
  }

  static readonly mapPromiseOfAction = (_: {[key in keyof PromiseOfAction]: any}): PromiseOfAction => ({
    ..._,
    expirationDate: new Date(new Date(_.expirationDate).toDateString()),
  })
}
