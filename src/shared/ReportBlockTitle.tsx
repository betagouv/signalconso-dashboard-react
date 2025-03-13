import { Icon } from '@mui/material'
import { ReactNode } from 'react'

export function ReportBlockTitle({
  icon,
  children,
}: {
  icon: string
  children: ReactNode
}) {
  return (
    <span className="">
      <Icon className="mb-[-5px] mr-1">{icon}</Icon>
      {children}
    </span>
  )
}
