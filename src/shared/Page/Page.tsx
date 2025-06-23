import { LinearProgress } from '@mui/material'
import { useLayoutContext } from 'core/context/layoutContext/layoutContext'
import { ReactNode } from 'react'
import { InfoBanner } from '../InfoBanner'

interface PageProps {
  loading?: boolean
  children: ReactNode
}

// Component to hold the main content
// leaving room for the side bar if needed and centered
export const Page = ({ loading, children }: PageProps) => {
  const { isMobileWidth } = useLayoutContext()
  const size = isMobileWidth ? 'w-full' : 'w-[95%]'
  return (
    <>
      {loading && (
        <div style={{ position: 'relative' }}>
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
      <div className={'p-2 pt-4 mx-auto ' + size}>
        <InfoBanner />
        {children}
      </div>
    </>
  )
}
