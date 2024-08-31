import { forwardRef, Ref } from 'react'

interface Props {
  firstName?: string
  lastName?: string
  missingLabel?: string
}

export const UserNameLabel = forwardRef(
  ({ firstName, lastName, missingLabel }: Props, ref: Ref<HTMLSpanElement>) => {
    return (
      <span ref={ref}>
        {firstName || lastName
          ? `${firstName} ${lastName}`
          : (missingLabel ?? null)}
      </span>
    )
  },
)
