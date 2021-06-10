import * as React from 'react'
import {HTMLProps, ReactNode} from 'react'
import {createStyles, Icon, makeStyles, Theme} from '@material-ui/core'
import classNames from 'classnames'
import {fade} from '@material-ui/core/styles'
import {useLayoutContext} from '../LayoutContext'
import {NavLink} from 'react-router-dom'

const useStyles = makeStyles((t: Theme) => createStyles({
  root: {
    transition: t.transitions.create('all'),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'inherit',
    paddingRight: t.spacing(3),
    paddingLeft: t.spacing(2),
    color: t.palette.text.secondary,
    minHeight: 32,
    margin: t.spacing(1, 1),
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
  rootActive: {
    color: t.palette.primary.main,
    background: fade(t.palette.primary.main, .16),
  },
  i: {
    // color: t.palette.text.secondary,
    textAlign: 'center',
    marginRight: t.spacing(1.5),
  },
  label: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    // fontSize: t.typography.fontSize,
    fontWeight: t.typography.fontWeightMedium,
  },
}))

export interface MenuItemProps extends HTMLProps<any> {
  icon?: string | ReactNode
  className?: any
  large?: boolean
  active?: boolean
  to?: string
}

export const MenuItem = ({children, to, icon, className, active, large, ...other}: MenuItemProps) => {
  const {closeMobileSidebar} = useLayoutContext()
  const classes = useStyles()

  const getClassName = (clickable: boolean = true) => classNames(
    className,
    classes.root,
    active && classes.rootActive,
    clickable && classes.rootClickable,
    large && classes.rootLarge,
  )

  return (
    <div onClick={closeMobileSidebar}>
      <NavLink activeClassName={classes.rootActive} to={to} {...other as any} className={getClassName(true)}>
        <>
          {icon && ((typeof icon === 'string')
              ? <Icon className={classes.i}>{icon}</Icon>
              : <div className={classNames(classes.i)}>{icon}</div>
          )}
          <span className={classes.label}>{children}</span>
        </>
      </NavLink>
    </div>
  )
}
