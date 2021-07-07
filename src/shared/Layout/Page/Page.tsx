import * as React from 'react'
import {Page as MuiPage} from 'mui-extension'
import {makeStyles, Theme} from '@material-ui/core'
import {classes} from '../../../core/helper/utils'
import {ReactNode} from 'react'

export const pageWidth = {
  large: 1100,
  regular: 932,
  small: 680,
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    padding: `${t.spacing(2)}px !important`,
  }
}));

export interface PageProps {
  className?: string,
  large?: boolean
  size?: 'large' | 'small' | 'regular'
  children: ReactNode
}

export const Page = ({className, size, ...props}: PageProps) => {
  const css = useStyles()
  return (
    <MuiPage width={pageWidth[size ?? 'regular']} className={classes(className, css.root)} {...props}/>
  )
}
