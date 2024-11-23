import { Id } from '../../model'
import { ApiClient } from '../ApiClient'
import { BarcodeProduct } from './BarcodeProduct'

export class BarcodeClient {
  constructor(private client: ApiClient) {}

  readonly get = (id: Id) => {
    return this.client.get<BarcodeProduct>(`/barcode/${id}`)
  }
}
