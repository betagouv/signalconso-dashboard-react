import { Icon } from '@mui/material'
import { ReactNode } from 'react'

// To display an icon inline before a text
export function WithInlineIcon({
  icon,
  children,
}: {
  icon: string
  children: ReactNode
}) {
  return (
    <span className="inline-flex items-start flex-wrap gap-1 underline">
      <Icon>{icon}</Icon>
      {children}
    </span>
  )
}
