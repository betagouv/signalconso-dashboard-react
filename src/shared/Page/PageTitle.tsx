import {ReactNode} from 'react'

interface Props {
  children: ReactNode
  action?: ReactNode
}

export const PageTitle = ({action, children}: Props) => {
  return (
    <div className="flex justify-between mb-4">
      <h1 className="text-4xl font-bold">{children}</h1>
      {action && <div>{action}</div>}
    </div>
  )
}
