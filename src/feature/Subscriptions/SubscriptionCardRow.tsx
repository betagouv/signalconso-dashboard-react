import React, {ReactNode} from 'react'
import {Divider, Icon, Theme} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {classes} from '../../core/helper/utils'

interface SubscriptionCardRowProps {
  icon: string
  label: string
  children: ReactNode
  onClick?: any
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    cursor: 'pointer',
    padding: t.spacing(1.5, 0),
    display: 'flex',
    alignItems: 'center',
    transition: t.transitions.create('background'),
    '&:hover': {
      background: t.palette.action.hover,
    }
  },
  label: {
    minWidth: 110,
  },
  body: {
    flex: 1,
  },
  icon: {
    color: t.palette.text.secondary,
    margin: t.spacing(0.5, 2, 0.5, 3),
  },
  divider: {
    marginLeft: t.spacing(3),
    '&:last-of-type': {
      display: 'none',
    },
  },
}))

export const SubscriptionCardRow = ({icon, label, children, onClick}: SubscriptionCardRowProps) => {
  const css = useStyles()
  const cssUtils = useCssUtils()

  return (
    <>
      <div className={css.root} onClick={onClick}>
        <Icon className={css.icon}>{icon}</Icon>
        <div className={css.label}>
          <Txt color="hint">{label}</Txt>
        </div>
        <div className={css.body}>{children}</div>
        <Icon className={classes(cssUtils.colorTxtHint, cssUtils.marginRight)}>chevron_right</Icon>
      </div>
      <Divider className={css.divider} />
    </>
  )
}
