import { layoutConfig } from 'core/Layout/layoutConfig'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function CenteredContent({ children }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center my-4 mx-2"
      style={{
        minHeight: `calc(100vh - ${layoutConfig.headerHeight}px)`,
      }}
    >
      {children}
    </div>
  )
}
