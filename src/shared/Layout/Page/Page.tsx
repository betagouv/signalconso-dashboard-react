import * as React from 'react'
import {Page as MuiPage} from 'mui-extension'
import {makeStyles, Theme} from '@material-ui/core'
import {classes} from '../../../core/helper/utils'

export const pageWidth = {
  large: 1100,
  regular: 932,
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    padding: `${t.spacing(2)}px !important`,
  }
}));

export interface PageProps {
  className?: string,
  large?: boolean
}

export const Page = ({className, large, ...props}: any) => {
  const css = useStyles()
  return (
    <MuiPage width={pageWidth[large ? 'large' : 'regular']} className={classes(className, css.root)} {...props}/>
  )
}
