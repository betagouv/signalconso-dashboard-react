import {LinearProgress} from '@mui/material'
import {useLayoutContext} from 'core/Layout/LayoutContext'
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

const pageSizesOrdered = ['s', 'm', 'l', 'xl'] as const

export const Page = ({loading, size = 'm', children}: PageProps) => {
  const {sidebarTakesSpaceInLayout} = useLayoutContext()
  const pageSizeIndex = pageSizesOrdered.indexOf(size)
  const sizes = !sidebarTakesSpaceInLayout
    ? [
        // same widths as tailwind breakpoint
        'w-full',
        'sm:w-[640px]',
        'md:w-[768px]',
        ...(pageSizeIndex > 1 ? ['lg:w-[1024px]'] : []),
        ...(pageSizeIndex > 2 ? ['xl:w-[1280px]'] : []),
        ...(pageSizeIndex > 3 ? ['2xl:w-[1536px]'] : []),
      ]
    : [
        // same, minus 220px to leave room for the sidebar
        'md:w-[528px]',
        ...(pageSizeIndex > 1 ? ['lg:w-[804px]'] : []),
        ...(pageSizeIndex > 2 ? ['xl:w-[1060px]'] : []),
        ...(pageSizeIndex > 3 ? ['2xl:w-[1316px]'] : []),
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
