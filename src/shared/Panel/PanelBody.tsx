import * as React from 'react'
import {BoxProps, CardContent as MuiCardContent} from '@mui/material'

interface Props extends BoxProps {
}

export const PanelBody = ({sx, children, ...other}: Props) => {
  return (
    <MuiCardContent {...other} sx={{
      borderRadius: '2px',
      p: 2,
      m: 0,
      '&:last-child': {
        pb: 2,
      },
      ...sx,
    }}>
      {children}
    </MuiCardContent>
  )
}
