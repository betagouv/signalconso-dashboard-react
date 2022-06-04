import * as React from 'react'
import {HTMLProps, ReactNode} from 'react'
import {Box, Icon} from '@mui/material'
import {alpha} from '@mui/material/styles'
import {useLayoutContext} from '../LayoutContext'
import {NavLink} from 'react-router-dom'
import {makeSx} from 'mui-extension'

const css = makeSx({
  root: {
    transition: t => t.transitions.create('all'),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'inherit',
    pr: 1,
    pl: 2,
    color: t => t.palette.text.secondary,
    minHeight: 32,
    my: 1 / 2,
    mw: 1,
    borderRadius: 42
  },
  rootLarge: {
    minHeight: 38
  },
  rootClickable: {
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(0, 0, 0, .05)'
    }
  },
  rootActive: {
    color: t => t.palette.primary.main,
    background: t => alpha(t.palette.primary.main, 0.16)
  },
  i: {
    // color: t.palette.text.secondary,
    textAlign: 'center',
    mr: 2
  },
  label: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    // fontSize: t.typography.fontSize,
    fontWeight: t => t.typography.fontWeightMedium
  }
})

export interface SidebarItemProps extends HTMLProps<any> {
  icon?: string | ReactNode
  className?: any
  large?: boolean
  active?: boolean
  to?: string
}

export const SidebarItem = ({children, to, icon, active, large, ...other}: SidebarItemProps) => {
  const {closeMobileSidebar} = useLayoutContext()

  return (
    <div onClick={closeMobileSidebar}>
      <Box
        component={NavLink}
        activeClassName={css.rootActive}
        to={to}
        sx={{
          ...css.root,
          ...css.rootClickable,
          ...active && css.rootActive,
          ...large && css.rootLarge
        }}
        {...(other as any)}
      >
        <>
          {icon &&
          (typeof icon === 'string' ? (
            <Icon sx={css.i}>{icon}</Icon>
          ) : (
            <Box sx={css.i}>{icon}</Box>
          ))}
          <Box component="span" sx={css.label}>{children}</Box>
        </>
      </Box>
    </div>
  )
}
