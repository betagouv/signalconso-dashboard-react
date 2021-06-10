import {PanelBody} from '../../../shared/Panel'
import {ReportEventComponent} from './ReportEvent'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {ReportEvent} from 'core/api'

interface Props {
  events: ReportEvent[]
}

export const ReportEvents = ({events}: Props) => {
  const {m} = useI18n()
  return (
    <PanelBody>
      {events.map(event =>
        <ReportEventComponent key={event.data.id} event={event}/>
      )}
    </PanelBody>
  )
}
