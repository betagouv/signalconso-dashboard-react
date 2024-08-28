import { Country } from '../client/constant/Country'

export interface Address {
  number?: string
  street?: string
  addressSupplement?: string
  postalCode?: string
  city?: string
  country?: Country
}
