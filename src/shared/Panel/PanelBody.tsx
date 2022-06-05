import * as React from 'react'
import {BoxProps, CardContent as MuiCardContent} from '@mui/material'

interface Props extends BoxProps {
}

export const PanelBody = ({className, children, ...other}: Props) => {
  return (
    <MuiCardContent {...other} className={className} sx={{
      borderRadius: '2px',
      p: 2,
      m: 0,
      // padding: '0 !important',
      // margin: t.spacing(1),
      // margin: padding(),
      '&:last-child': {
        pb: 2,
      },
    }}>
      {children}
    </MuiCardContent>
  )
}
