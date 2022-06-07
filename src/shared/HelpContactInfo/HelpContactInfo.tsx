import {Txt} from 'mui-extension/lib/Txt/Txt'
import React from 'react'
import {useI18n} from '../../core/i18n'

export const HelpContactInfo = () => {
  const {m} = useI18n()
  return (
    <Txt
      color="hint"
      sx={{
        mb: 1,
        '& a': {
          color: t => t.palette.primary.main,
          fontWeight: t => t.typography.fontWeightBold,
        },
      }}
    >
      <div dangerouslySetInnerHTML={{__html: m.loginIssueTip}} />
    </Txt>
  )
}
