import {Company, CompanyCreation} from '../company/Company'
import {ApiClientApi} from '../ApiClient'
import {BarcodeProduct} from './BarcodeProduct'
import {Id} from '../../model'

export class BarcodeClient {
  constructor(private client: ApiClientApi) {}

  readonly get = (id: Id) => {
    return this.client.get<BarcodeProduct>(`/barcode/${id}`)
  }
}
