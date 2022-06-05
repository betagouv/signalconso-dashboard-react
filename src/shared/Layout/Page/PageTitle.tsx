import * as React from 'react'
import {ReactNode} from 'react'
import {BoxProps, Typography} from '@mui/material'

interface Props extends BoxProps {
  action?: ReactNode
}

export const PageTitle = ({action, children, sx, ...props}: Props) => {
  return (
    <Typography
      variant="h5"
      sx={{
        ...sx,
        mt: 1,
        mb: 3,
        display: "flex",
        alignItems: "center"
      }}
      {...props}
    >
      {children}
      {action && <div style={{marginLeft: "auto"}}>{action}</div>}
    </Typography>
  );
};
