import {PanelBody} from '../../shared/Panel'
import React, {useEffect} from 'react'
import {useReportContext} from '../../core/context/ReportContext'
import {useI18n} from '../../core/i18n'
import {EventActionValues, ReportEvent, ReportResponse} from '../../core/api'

interface Props {
  events: ReportEvent[]
}

export const ReportMessages = ({events}: Props) => {
  const _report = useReportContext()
  const {m} = useI18n()

  const getEvent = (eventActionValue: EventActionValues): ReportEvent | undefined => {
    return events.find(event => event.data.action === eventActionValue)
  }

  const getReportResponse = (): ReportResponse | undefined => {
    const reportResponseEvent = getEvent(EventActionValues.ReportResponse)
    if (reportResponseEvent) {
      return reportResponseEvent.data.details as ReportResponse
    }
  }

  useEffect(() => {
  }, [])

  return (
    <PanelBody>
    </PanelBody>
  )
}
