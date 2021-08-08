import React from 'react'
import {Confirm} from 'mui-extension/lib'
import {Report} from '../../core/api'
import {useI18n} from '../../core/i18n'
import {ScButton} from '../../shared/Button/Button'

interface Props {
  report: Report
}

export const ReportProAnswer = ({report}: Props) => {
  const {m} = useI18n()

  return (
    <Confirm
      title={m.answer}>
      <ScButton icon="priority_high" color="error" variant="contained">
        {m.answer}
      </ScButton>
    </Confirm>
  )
}
