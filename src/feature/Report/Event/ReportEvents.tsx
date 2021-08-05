import {PanelBody} from '../../../shared/Panel'
import {ReportEventComponent} from './ReportEvent'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {ReportEvent} from 'core/api'
import {Fender} from 'mui-extension/lib'

interface Props {
  events: ReportEvent[]
}

export const ReportEvents = ({events}: Props) => {
  const {m} = useI18n()
  return (
    <PanelBody>
      {events.length === 0 ? (
        <Fender type="empty">{m.noDataAtm}</Fender>
      ) : (
        events
          .sort((a, b) => a.data.creationDate.getTime() - b.data.creationDate.getTime())
          .map(event =>
            <ReportEventComponent key={event.data.id} event={event}/>,
          ))}
    </PanelBody>
  )
}
