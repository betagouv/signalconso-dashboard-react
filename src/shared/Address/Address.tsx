import {Address} from '../../core/api/model/Address'
import React from 'react'

interface Props {
  address: Address
}

export const AddressComponent = ({address}: Props) => {
  return (
    <>
      {address.number}
      {address.street}
      {address.addressSupplement}
      <br/>
      {address.postalCode}
      {address.city}
      {address.country && (
        <>
          <br/>
          {address.country}
        </>
      )}
    </>
  )
}
