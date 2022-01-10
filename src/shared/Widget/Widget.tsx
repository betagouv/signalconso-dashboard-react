import {Panel, PanelBody} from '../Panel'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import * as React from 'react'
import {ReactNode} from 'react'
import {Icon, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {NavLink} from 'react-router-dom'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {styleUtils} from '../../core/theme'

interface Props {
  title: ReactNode
  children: ReactNode
  loading?: boolean
  to?: string
}

const useStyles = makeStyles((t: Theme) => ({
  title: {
    display: 'flex',
    alignItems: 'center',
  },
  toIcon: {
    marginLeft: t.spacing(1),
    color: t.palette.text.disabled,
    fontSize: styleUtils(t).fontSize.big,
  },
  hoverable: {
    transition: t.transitions.create('all'),
    '&:hover': {
      borderColor: t.palette.background.default,
      boxShadow: t.shadows[3],
      // borderColor: t.palette.primary.main,
      // boxShadow: `inset 0 0 0 1px ${t.palette.primary.main}`,
    },
  },
}))

export const Widget = ({loading, title, to, children}: Props) => {
  const css = useStyles()
  const body = (
    <Panel className={to && css.hoverable}>
      <PanelBody>
        <Txt block uppercase color="hint" size="small" gutterBottom className={css.title}>
          {title}
          {to && (
            <Icon fontSize="inherit" className={css.toIcon}>
              open_in_new
            </Icon>
          )}
        </Txt>
        {children}
      </PanelBody>
    </Panel>
  )
  return to ? <NavLink to={to}>{body}</NavLink> : body
}
