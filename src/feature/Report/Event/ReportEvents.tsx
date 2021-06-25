import {PanelBody} from '../../../shared/Panel'
import {ReportEventComponent} from './ReportEvent'
import React from 'react'
import {useI18n} from '../../../core/i18n'
import {EventActionValues, Report, ReportEvent} from 'core/api'

interface Props {
  report: Report,
  events: ReportEvent[]
}

export const ReportEvents = ({report, events}: Props) => {
  const {m} = useI18n()
  return (
    <PanelBody>
      <ReportEventComponent event={{
        data: {
          id: 'dummy',
          details: {} as any,
          reportId: report.id,
          eventType: 'CONSO',
          creationDate: report.creationDate,
          action: EventActionValues.Creation,
        }
      }}/>
      {events
        .sort((a, b) => a.data.creationDate.getTime() - b.data.creationDate.getTime())
        .map(event =>
          <ReportEventComponent key={event.data.id} event={event}/>
        )}
    </PanelBody>
  )
}
