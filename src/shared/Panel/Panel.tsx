import { Card, CardProps, LinearProgress } from '@mui/material'
import * as React from 'react'
import { forwardRef } from 'react'

export interface PanelProps extends CardProps {
  loading?: boolean
  stretch?: boolean
  elevation?: number
}

export const Panel = forwardRef(
  (
    { elevation = 0, loading, children, stretch, sx, ...other }: PanelProps,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <Card
        ref={ref}
        elevation={elevation}
        sx={{
          borderRadius: (t) => t.shape.borderRadius + 'px',
          mb: 2,
          ...(stretch && {
            display: 'flex',
            flexDirection: 'column',
            height: (t) => `calc(100% - ${t.spacing(2)})`,
          }),
          ...(elevation === 0 && {
            border: (t) => `1px solid ${t.palette.divider}`,
          }),
          ...sx,
        }}
        {...other}
      >
        {loading && <LinearProgress sx={{ mb: '-4px' }} />}
        {children}
      </Card>
    )
  },
)
