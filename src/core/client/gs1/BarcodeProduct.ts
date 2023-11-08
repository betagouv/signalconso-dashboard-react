import {Address, Id} from '../../model'

export interface BarcodeProduct {
  id: Id
  gtin: string
  productDescription?: string
  brandName?: string
  subBrandName?: string
  netContent?: NetContent[]
  globalLocationNumber?: string
  companyName?: string
  postalAddress?: Address
  siren?: string
}

interface NetContent {
  unitCode?: string
  quantity?: string
}
