import React, {ReactNode} from 'react'
import {Divider, Icon, Theme} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Txt} from 'mui-extension/lib/Txt/Txt'

interface SubscriptionCardRowProps {
  icon: string
  label: string
  children: ReactNode
  onClick?: any
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    padding: t.spacing(1.5, 0),
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    minWidth: 110,
  },
  icon: {
    color: t.palette.text.secondary,
    margin: t.spacing(.5, 2, .5, 3)
  },
  divider: {
    marginLeft: t.spacing(3),
    '&:last-of-type': {
      display: 'none',
    }
  }
}))

export const SubscriptionCardRow = ({icon, label, children, onClick}: SubscriptionCardRowProps) => {
  const css = useStyles()

  return (
    <>
      <div className={css.root} onClick={onClick}>
        <Icon className={css.icon}>{icon}</Icon>
        <div className={css.label}>
          <Txt color="hint">{label}</Txt>
        </div>
        <div>{children}</div>
      </div>
      <Divider className={css.divider}/>
    </>
  )
}
