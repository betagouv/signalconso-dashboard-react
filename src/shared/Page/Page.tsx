import { LinearProgress } from '@mui/material'
import { useLayoutContext } from 'core/Layout/LayoutContext'
import { ReactNode } from 'react'
import { InfoBanner } from '../InfoBanner'

interface PageProps {
  maxWidth?: 'xl' | 'l' | 's' | 'm'
  loading?: boolean
  children: ReactNode
}

const maxWidthsOrdered = ['s', 'm', 'l', 'xl'] as const

// Component to hold the main content
// Fixed width (varying on each breakpoint), leaving room for the side bar if needed
// and centered
export const Page = ({ loading, maxWidth = 'xl', children }: PageProps) => {
  const { sidebarTakesSpaceInLayout } = useLayoutContext()
  const maxWidthIndex = maxWidthsOrdered.indexOf(maxWidth)
  const sizes = !sidebarTakesSpaceInLayout
    ? [
        // same widths as tailwind breakpoint
        'w-full',
        'sm:w-[640px]',
        'md:w-[768px]',
        ...(maxWidthIndex > 0 ? ['lg:w-[1024px]'] : []),
        ...(maxWidthIndex > 1 ? ['xl:w-[1280px]'] : []),
        ...(maxWidthIndex > 2 ? ['2xl:w-[1536px]'] : []),
      ]
    : [
        // same, minus 240px to leave room for the sidebar
        'md:w-[508px]',
        ...(maxWidthIndex > 0 ? ['lg:w-[784px]'] : []),
        ...(maxWidthIndex > 1 ? ['xl:w-[1040px]'] : []),
        ...(maxWidthIndex > 2 ? ['2xl:w-[1296px]'] : []),
      ]
  const sizesClass = sizes.join(' ')
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
      <div className={'p-2 pt-4 mx-auto ' + sizesClass}>
        <InfoBanner />
        {children}
      </div>
    </>
  )
}
