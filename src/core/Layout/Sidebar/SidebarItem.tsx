import { Box, BoxProps, Icon } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { ReactNode } from 'react'
import { NavLink } from 'react-router'
import { makeSx } from '../../../alexlibs/mui-extension'

const css = makeSx({
  i: {
    textAlign: 'center',
    mr: 2,
  },
})

interface SidebarItemProps extends BoxProps {
  icon?: string | ReactNode
  large?: boolean
  active?: boolean
  to?: string
}

export const SidebarItem = ({
  children,
  to,
  icon,
  className,
  active,
  large,
  sx,
  ...props
}: SidebarItemProps) => {
  const navLinkProps = to
    ? {
        component: NavLink,
        to,
      }
    : {}
  return (
    <Box
      {...navLinkProps}
      sx={{
        transition: (t) => t.transitions.create('all'),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'inherit',
        minHeight: 36,
        color: (t) => t.palette.text.secondary,
        pr: 1,
        pl: 0.85,
        my: 1 / 2,
        mx: 1,
        borderRadius: 42,
        ...(large && {
          minHeight: 38,
        }),
        ...(active && {
          color: (t) => t.palette.primary.main,
          background: (t) => alpha(t.palette.primary.main, 0.16),
        }),
        ...((to || props.onClick) && {
          cursor: 'pointer',
          '&:hover': {
            background: 'rgba(0, 0, 0, .05)',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {icon &&
        (typeof icon === 'string' ? (
          <Icon sx={css.i}>{icon}</Icon>
        ) : (
          <Box sx={css.i}>{icon}</Box>
        ))}
      <Box
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          fontWeight: (t) => t.typography.fontWeightMedium,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
