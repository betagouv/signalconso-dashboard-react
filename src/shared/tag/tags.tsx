import { Theme, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import * as React from 'react'
import {classes} from '../../core/helper/utils'

const useH1Styles = makeStyles((t: Theme) => ({
  root: {
    lineHeight: 2.25,
  },
}))

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const H1 = ({children, className, style}: Props) => {
  const css = useH1Styles()
  return (
    <Typography variant="h5" gutterBottom className={classes(css.root, className)} style={style}>
      {children}
    </Typography>
  )
}
