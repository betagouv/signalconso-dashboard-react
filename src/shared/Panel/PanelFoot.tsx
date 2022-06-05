import * as React from 'react'
import {CardActions, CardActionsProps} from '@mui/material'

export interface PanelFootProps extends CardActionsProps {
  alignEnd?: boolean
  border?: boolean
}

export const PanelFoot = ({children, alignEnd, border, sx, ...props}: PanelFootProps) => {
  return (
    <CardActions
      {...props}
      sx={{
        ...sx,
        marginTop: 'auto',
        mx: 2,
        pb: 1,
        ...alignEnd && {
          display: 'flex',
          justifyContent: 'flex-end',
        },
        ...border && {
          pt: 1,
          borderTop:  t => '1px solid ' + t.palette.divider,
        }
      }}>
      {children}
    </CardActions>
  )
}
