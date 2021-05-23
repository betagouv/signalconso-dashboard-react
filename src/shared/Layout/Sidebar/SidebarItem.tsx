import * as React from 'react'
import {HTMLProps, ReactChild, ReactElement} from 'react'
import {Icon, makeStyles, Theme} from '@material-ui/core'
import {fade} from '@material-ui/core/styles'
import {classes} from '../../../core/helper/utils'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    transition: t.transitions.create('all'),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'inherit',
    paddingRight: t.spacing(1),
    paddingLeft: t.spacing(2),
    color: t.palette.text.primary,
    minHeight: 32,
    marginTop: t.spacing(1 / 8),
    marginBottom: t.spacing(1 / 8),
    marginRight: t.spacing(1),
    marginLeft: t.spacing(1),
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
    textAlign: 'center',
    marginRight: t.spacing(2),
  },
  label: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    // display: 'flex',
    // alignItems: 'center',
    flex: 1,
    fontSize: t.typography.fontSize,
    fontWeight: t.typography.fontWeightMedium,
  },
}))

interface IProps extends HTMLProps<any> {
  icon?: string | ReactChild
  to?: any
  href?: any
  className?: any
  large?: boolean
}

export const SidebarItem = ({href, to, children, icon, className, large = true, ...other}: IProps) => {
  const css = useStyles()

  const getClassName = (clickable: boolean = true) => classes(
    className,
    css.root,
    clickable && css.rootClickable,
    large && css.rootLarge,
  )

  const renderRoot = (element: ReactElement<any>) => {
    return (
      <div {...other as any} className={getClassName(!!other.onClick)}>
        {element}
      </div>
    )
  }

  // const renderRootNavLink = (element: ReactElement<any>, to: any) => {
  //   return (
  //     <NavLink {...other} to={to} className={getClassName()} activeClassName={css.rootActive}>
  //       {element}
  //     </NavLink>
  //   );
  // };

  const renderRootHref = (element: ReactElement<any>, href: any) => {
    return (
      <a {...other as any} href={href} className={getClassName()}>
        {element}
      </a>
    )
  }

  const content = (
    <>
      {icon && ((typeof icon === 'string')
          ? <Icon className={css.i}>{icon}</Icon>
          : <div className={classes(css.i)}>{icon}</div>
      )}
      <span className={css.label}>{children}</span>
    </>
  )
  let wrapper
  // if (to) wrapper = renderRootNavLink(content, to);
  // else
  if (href) wrapper = renderRootHref(content, href)
  else wrapper = renderRoot(content)
  return (
    <>
      {wrapper}
    </>
  )
}

