import { Country } from '../client/constant/Country'

export interface Address {
  number?: string
  street?: string
  addressSupplement?: string
  postalCode?: string
  city?: string
  country?: Country
}

export function isAddressEmpty(address: Address) {
  return (
    !address.number &&
    !address.street &&
    !address.addressSupplement &&
    !address.postalCode &&
    !address.city &&
    !address.country
  )
}
