import {Id} from '../../model'

export interface BarcodeProduct {
  id: Id
  gtin: string
  productName?: string
  brandName?: string
  emb_codes?: string
  packaging?: string
  existOnOpenFoodFacts: boolean
  existOnOpenBeautyFacts: boolean
  existOnGS1: boolean
}
