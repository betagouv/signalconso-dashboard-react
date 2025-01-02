import { ReactNode } from 'react'

export function CompanyStatsPanelTitle({
  children,
  bottomMargin = false,
}: {
  children: ReactNode
  bottomMargin?: boolean
}) {
  return (
    <h2 className={`text-2xl font-bold ${bottomMargin ? 'mb-2' : ''}`}>
      {children}
    </h2>
  )
}
