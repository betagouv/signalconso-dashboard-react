import {Id} from '../../model'

export interface GS1Product {
  id: Id
  gtin: string
  siren?: string
  description?: string
  creationDate: Date
}
