import {Fender} from '../../../alexlibs/mui-extension'
import {ReportEvent} from '../../../core/client/event/Event'
import {useI18n} from '../../../core/i18n'
import {ReportEventComponent} from './ReportEvent'

interface Props {
  events?: ReportEvent[]
}

export const ReportEvents = ({events}: Props) => {
  const {m} = useI18n()
  return (
    <div>
      {!events ? (
        <Fender type="loading" />
      ) : events.length === 0 ? (
        <div>{m.noDataAtm}</div>
      ) : (
        events
          .sort((a, b) => a.data.creationDate.getTime() - b.data.creationDate.getTime())
          .map(event => <ReportEventComponent key={event.data.id} event={event} />)
      )}
    </div>
  )
}
