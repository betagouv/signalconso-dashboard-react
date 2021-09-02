import {makeStyles} from '@material-ui/core/styles'
import {Theme} from '@material-ui/core'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import React from 'react'
import {useI18n} from '../../core/i18n'

const useStyles = makeStyles((t: Theme) => ({
  foot: {
    marginTop: t.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  hint: {
    marginBottom: t.spacing(1),
    '& a': {
      color: t.palette.primary.main,
      fontWeight: t.typography.fontWeightBold,
    },
  },
}))

export const HelpContactInfo = () => {
  const css = useStyles()
  const {m} = useI18n()
  return (
    <Txt color="hint" className={css.hint}>
      <div dangerouslySetInnerHTML={{__html: m.loginIssueTip}} />
    </Txt>
  )
}
