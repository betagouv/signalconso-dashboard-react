import {LinearProgress} from '@mui/material'
import {useLayoutContext} from 'core/Layout/LayoutContext'
import {ReactNode} from 'react'

export interface PageProps {
  maxWidth?: 'xl' | 'l' | 's' | 'm'
  loading?: boolean
  children: ReactNode
}

const maxWidthsOrdered = ['s', 'm', 'l', 'xl'] as const

export const Page = ({loading, maxWidth = 'xl', children}: PageProps) => {
  const {sidebarTakesSpaceInLayout} = useLayoutContext()
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
        // same, minus 220px to leave room for the sidebar
        'md:w-[528px]',
        ...(maxWidthIndex > 0 ? ['lg:w-[804px]'] : []),
        ...(maxWidthIndex > 1 ? ['xl:w-[1060px]'] : []),
        ...(maxWidthIndex > 2 ? ['2xl:w-[1316px]'] : []),
      ]
  const sizesClass = sizes.join(' ')
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
      <div className={'p-2 pt-4 mx-auto ' + sizesClass}>{children}</div>
    </>
  )
}
