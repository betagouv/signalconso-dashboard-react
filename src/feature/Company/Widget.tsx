import {Panel, PanelBody} from '../../shared/Panel'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import * as React from 'react'
import {ReactNode} from 'react'
import {Icon, makeStyles, Theme} from '@material-ui/core'
import {NavLink} from 'react-router-dom'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {classes} from '../../core/helper/utils'
import {styleUtils} from '../../core/theme'

interface Props {
  title: ReactNode
  children: ReactNode
  loading?: boolean
  to?: string
}

const useStyles = makeStyles((t: Theme) => ({
  cardValue: {
    fontSize: 36,
    lineHeight: 1,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
  },
  toIcon: {
    marginLeft: t.spacing(1),
    color: t.palette.text.hint,
    fontSize: styleUtils(t).fontSize.big
  },
  hoverable: {
    transition: t.transitions.create('all'),
    '&:hover': {
      borderColor: t.palette.background.default,
      boxShadow: t.shadows[3],
      // borderColor: t.palette.primary.main,
      // boxShadow: `inset 0 0 0 1px ${t.palette.primary.main}`,
    }
  }
}))

export const Widget = ({loading, title, to, children}: Props) => {
  const css = useStyles()
  const cssUtils = useCssUtils()
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
        <Txt skeleton={loading} className={css.cardValue}>
          {children}
        </Txt>
      </PanelBody>
    </Panel>
  )
  return to ? (
    <NavLink to={to}>{body}</NavLink>
  ) : body
}
