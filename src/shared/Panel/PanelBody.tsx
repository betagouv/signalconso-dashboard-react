import * as React from 'react'
import {ReactNode} from 'react'
import { CardContent as MuiCardContent, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {classes} from '../../core/helper/utils'
import {styleUtils} from '../../core/theme'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    borderRadius: 2,
    padding: styleUtils(t).spacing(2, 2, 2, 2),
    margin: styleUtils(t).spacing(0, 0, 0, 0),
    // padding: '0 !important',
    // margin: t.spacing(1),
    // margin: padding(),
    '&:last-child': {
      paddingBottom: t.spacing(2),
    },
  },
}))

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: any
  children?: ReactNode
}

export const PanelBody = ({className, children, ...other}: Props) => {
  const css = useStyles()
  return (
    <MuiCardContent {...other} className={classes(css.root, className)}>
      {children}
    </MuiCardContent>
  )
}
