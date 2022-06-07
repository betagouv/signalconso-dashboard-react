import * as React from 'react'
import {HTMLProps, ReactNode} from 'react'
import {Box, Icon, Theme} from '@mui/material'
import {alpha} from '@mui/material/styles'
import {useLayoutContext} from '../LayoutContext'
import {NavLink} from 'react-router-dom'
import {makeSx} from 'mui-extension'

const sx = makeSx({
  root: {
    transition: t => t.transitions.create('all'),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'inherit',
    pr: 3,
    pl: 2,
    color: t => t.palette.text.secondary,
    minHeight: 32,
    m: 1,
    borderRadius: 42,
  },
  rootLarge: {
    minHeight: 38,
  },
  rootClickable: {
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(0, 0, 0, .05)',
    },
  },
  i: {
    // color: t.palette.text.secondary,
    textAlign: 'center',
    mr: 1.5,
  },
  label: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    // fontSize: t.typography.fontSize,
    fontWeight: t => t.typography.fontWeightMedium,
  },
})

export interface MenuItemProps extends HTMLProps<any> {
  icon?: string | ReactNode
  className?: any
  large?: boolean
  active?: boolean
  to?: string
}

const styleActive = (t: Theme) => ({
  color: t.palette.primary.main,
  background: alpha(t.palette.primary.main, 0.16),
})

export const ScAppMenuItem = ({children, to, icon, className, active, large, ...other}: MenuItemProps) => {
  const {closeMobileSidebar} = useLayoutContext()
  return (
    <div onClick={closeMobileSidebar}>
      <Box
        {...(other as any)}
        component={NavLink}
        to={to}
        activeStyle={styleActive}
        style={active && styleActive}
        sx={{
          ...sx.root,
          ...sx.rootClickable,
          ...(large && sx.rootLarge),
        }}
      >
        <>
          {icon && (typeof icon === 'string' ? <Icon sx={sx.i}>{icon}</Icon> : <Box sx={sx.i}>{icon}</Box>)}
          <Box component="span" sx={sx.label}>
            {children}
          </Box>
        </>
      </Box>
    </div>
  )
}
