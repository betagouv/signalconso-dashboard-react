import {LinearProgress} from '@mui/material'
import {ReactNode} from 'react'

export const pageWidth = {
  xl: 1400,
  l: 1100,
  m: 932,
  s: 680,
}

export interface PageProps {
  size?: 'xl' | 'l' | 's' | 'm'
  loading?: boolean
  children: ReactNode
}

export const Page = ({loading, size = 'm', children}: PageProps) => {
  return (
    <>
      {loading && (
        <div style={{position: 'relative'}}>
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
            }}
          />
        </div>
      )}
      <div style={{maxWidth: pageWidth[size]}} className="p-2 pt-4 mx-auto">
        {children}
      </div>
    </>
  )
}
