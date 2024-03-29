import React, {forwardRef} from 'react'

interface Props {
  firstName?: string
  lastName?: string
  missingLabel?: string
}

export const UserNameLabel = forwardRef(({firstName, lastName, missingLabel}: Props, ref: any) => {
  return <span ref={ref}>{firstName || lastName ? `${firstName} ${lastName}` : missingLabel ?? null}</span>
})
