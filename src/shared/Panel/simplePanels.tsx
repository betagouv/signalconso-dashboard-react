import {LinearProgress} from '@mui/material'
import {ReactNode} from 'react'

// Just a simple container, with a wide padding
export function CleanWidePanel({
  children,
  ref,
  loading,
}: {
  children: ReactNode
  ref?: React.RefObject<HTMLDivElement>
  loading?: boolean
}) {
  return (
    <div className={`p-8 border-solid border border-gray-500 rounded shadow-md mb-4`} ref={ref}>
      {loading ? (
        <div className="min-h-[100px]">
          <LinearProgress className="" />
        </div>
      ) : (
        children
      )}
    </div>
  )
}

// An alternative, less visible, and less padding, for smaller, more often repeated usages
export function CleanDiscreetPanel({
  children,
  ref,
  loading,
  noPaddingTop,
  fullHeight,
}: {
  children: ReactNode
  ref?: React.RefObject<HTMLDivElement>
  loading?: boolean
  noPaddingTop?: boolean
  fullHeight?: boolean
}) {
  return (
    <div
      className={`p-4 ${noPaddingTop ? 'pt-0' : ''} ${
        fullHeight ? 'h-full' : ''
      } border-solid border border-gray-300 rounded shadow-md `}
      ref={ref}
    >
      {loading ? (
        <div className="min-h-[100px]">
          <LinearProgress className="" />
        </div>
      ) : (
        children
      )}
    </div>
  )
}
