import { EventActionValues } from 'core/client/event/Event'

import { EventType, Report } from 'core/model'

import { ReportEvent } from 'core/client/event/Event'

const CONSO: EventType = 'CONSO'

export const creationReportEvent = (report: Report): ReportEvent =>
  Object.freeze({
    data: {
      id: 'dummy',
      details: {} as any,
      reportId: report.id,
      eventType: CONSO,
      creationDate: report.creationDate,
      action: EventActionValues.Creation,
    },
  })
