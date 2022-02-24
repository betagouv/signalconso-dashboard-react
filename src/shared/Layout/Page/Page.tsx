import * as React from 'react'
import {ReactNode} from 'react'
import {Page as MuiPage} from 'mui-extension'
import {LinearProgress, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {classes} from '../../../core/helper/utils'

export const pageWidth = {
  xl: 1400,
  l: 1100,
  m: 932,
  s: 680,
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    padding: `${t.spacing(3)} ${t.spacing(2)} ${t.spacing(2)} ${t.spacing(2)} !important`,
  },
  loading: {
    position: 'relative',
  },
  loadingSpinner: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
}))

export interface PageProps {
  className?: string
  large?: boolean
  size?: 'xl' | 'l' | 's' | 'm'
  children: ReactNode
  loading?: boolean
}

export const Page = ({className, loading, size, ...props}: PageProps) => {
  const css = useStyles()
  return (
    <>
      {loading && (
        <div className={css.loading}>
          <LinearProgress className={css.loadingSpinner} />
        </div>
      )}
      <MuiPage width={pageWidth[size ?? 'm']} className={classes(className, css.root)} {...props} />
    </>
  )
}
