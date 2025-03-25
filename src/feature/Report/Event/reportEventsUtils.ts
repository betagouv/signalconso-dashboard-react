import { EventActionValues, EventWithUser } from 'core/client/event/Event'

import { EventType, Report } from 'core/model'

const CONSO: EventType = 'CONSO'

export const creationReportEvent = (report: Report): EventWithUser =>
  Object.freeze({
    event: {
      id: 'dummy',
      details: {} as any,
      reportId: report.id,
      eventType: CONSO,
      creationDate: report.creationDate,
      action: EventActionValues.Creation,
    },
  })
