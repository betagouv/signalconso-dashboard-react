import {LinearProgress} from '@mui/material'
import {ReactNode} from 'react'
import MxPage from '../../alexlibs/mui-extension/MxPage'

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

export const Page = ({loading, size = 'm', ...props}: PageProps) => {
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
      <MxPage
        {...props}
        sx={{
          p: 2,
          pt: 3,
        }}
        width={pageWidth[size]}
        {...props}
      />
    </>
  )
}
