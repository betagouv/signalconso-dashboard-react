import { Box, BoxProps } from '@mui/material'
import { layoutConfig } from '../layoutConfig'

interface SidebarHeaderProps extends BoxProps {
  hidden?: boolean
}

export const SidebarHeader = ({
  hidden,
  children,
  sx,
  ...props
}: SidebarHeaderProps) => {
  return (
    <Box
      sx={{
        height: layoutConfig.headerHeight,
        opacity: 1,
        transition: (t) => t.transitions.create('all'),
        pt: 1,
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        px: layoutConfig.headerPx,
        borderTop: (t) => '1px solid ' + t.palette.divider,
        borderBottom: (t) => '1px solid ' + t.palette.divider,
        ...(hidden && {
          height: 0,
          p: 0,
          border: 'none',
          opacity: 0,
        }),
        ...sx,
      }}
      {...props}
    />
  )
}
