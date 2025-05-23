import { LinearProgress } from '@mui/material'
import { forwardRef, ReactNode, Ref } from 'react'

interface CleanWidePanelProps {
  children: ReactNode
  loading?: boolean
}

// Just a simple container, with a wide padding
export const CleanWidePanel = forwardRef(function CleanWidePanel(
  { children, loading }: CleanWidePanelProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      className={`p-8 border-solid border border-gray-500 rounded shadow-md mb-4`}
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
})

interface CleanDiscreetPanelProps {
  children: ReactNode
  ref?: React.RefObject<HTMLDivElement>
  loading?: boolean
  noPaddingTop?: boolean
  fullHeight?: boolean
  noShadow?: boolean
}

// An alternative, less visible, and less padding, for smaller, more often repeated usages
export const CleanDiscreetPanel = forwardRef(function (
  {
    children,
    loading,
    noPaddingTop,
    fullHeight,
    noShadow,
  }: CleanDiscreetPanelProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      className={`p-4 mb-4 ${noPaddingTop ? 'pt-0' : ''} ${
        fullHeight ? 'h-full' : ''
      } border-solid border border-gray-300 rounded ${
        noShadow ? '' : 'shadow-md'
      } `}
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
})

export const CleanInvisiblePanel = forwardRef(function (
  {
    children,
    loading,
    fullHeight,
  }: {
    children: ReactNode
    ref?: React.RefObject<HTMLDivElement>
    loading?: boolean
    fullHeight?: boolean
  },
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div className={`mb-8 ${fullHeight ? 'h-full' : ''}`} ref={ref}>
      {loading ? (
        <div className="min-h-[100px] bg-gray-100">
          <LinearProgress className="" />
        </div>
      ) : (
        children
      )}
    </div>
  )
})
