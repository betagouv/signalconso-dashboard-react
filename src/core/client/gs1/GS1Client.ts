import {Company, CompanyCreation} from '../company/Company'
import {ApiClientApi} from '../ApiClient'
import {GS1Product} from './GS1Product'
import {Id} from '../../model'

export class GS1Client {
  constructor(private client: ApiClientApi) {}

  readonly get = (id: Id) => {
    return this.client.get<GS1Product>(`/gs1/${id}`)
  }
}
