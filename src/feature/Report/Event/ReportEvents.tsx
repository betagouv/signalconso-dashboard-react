import { Icon } from '@mui/material'
import { Fender } from '../../../alexlibs/mui-extension'
import {
  EventActionValues,
  ReportEvent,
} from '../../../core/client/event/Event'
import { useI18n } from '../../../core/i18n'
import { ReportEventIcon } from './ReportEventIcon'
import { UserNameLabel } from '../../../shared/UserNameLabel'

interface Props {
  events?: ReportEvent[]
}

export const ReportEvents = ({ events }: Props) => {
  const { m } = useI18n()
  return (
    <div>
      {!events ? (
        <Fender type="loading" />
      ) : events.length === 0 ? (
        <div>{m.noDataAtm}</div>
      ) : (
        <table className={'break-words w-full table-fixed'}>
          <tbody>
            {events
              .sort(
                (a, b) =>
                  a.data.creationDate.getTime() - b.data.creationDate.getTime(),
              )
              .map((event) => (
                <ReportEventComponent key={event.data.id} event={event} />
              ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const ReportEventComponent = ({ event }: { event: ReportEvent }) => {
  const { formatDate, formatTime } = useI18n()

  return (
    <tr className="text-base border-b-[1px] last:border-b-0 border-solid border-0 border-gray-300">
      <td className="p-2 w-[6.5rem]">
        <p className="font-bold">
          {formatDate(event.data.creationDate)}{' '}
          <span className=" font-normal text-gray-500">
            à {formatTime(event.data.creationDate)}
          </span>
        </p>
      </td>
      <td className="p-2  w-10">
        <ReportEventIcon action={event.data.action} />
      </td>
      <td className="p-2 ">
        {translateEventAction(event.data.action)}
        {event.user && (
          <div className="text-sm text-gray-500">
            <Icon className="!text-sm">person</Icon>
            &nbsp;
            <span className="">
              <UserNameLabel
                lastName={event.user.lastName}
                firstName={event.user.firstName}
              />{' '}
              {event.user.role}
            </span>
          </div>
        )}
        {event.data.action === EventActionValues.UserAccessCreated && (
          <p className="text-sm text-gray-500">
            Utilisateur concerné : {(event.data.details as any)?.email} (
            {(event.data.details as any)?.level})
          </p>
        )}
        {event.data.action === EventActionValues.UserAccessRemoved && (
          <p className="text-sm text-gray-500">
            Utilisateur impacté : {(event.data.details as any)?.email}
          </p>
        )}
        <p className="text-sm text-gray-500">
          {(event.data.details as any)?.description}
        </p>
        {(event.data.details as any)?.comment && (
          <div className={'  mt-1  flex-row'}>
            <span className="text-sm text-black">Commentaire :</span>
            <p className="text-sm text-blue-600">
              {(event.data.details as any)?.comment}
            </p>
          </div>
        )}
        {event.data.action === EventActionValues.Reattribution && (
          <>
            <p className="text-sm text-gray-500">
              Signalement : {(event.data.details as any)?.newReportId}
            </p>
            <p className="text-sm text-gray-500">
              Entreprise : {(event.data.details as any)?.newCompanyId}
            </p>
          </>
        )}
      </td>
    </tr>
  )
}

function translateEventAction(action: EventActionValues) {
  switch (action) {
    case EventActionValues.ConsumerThreatenByProReportDeletion:
      return "Suppression par un membre de l'équipe SignalConso (menaces venant du pro)"
    case EventActionValues.RefundBlackMailReportDeletion:
      return "Suppression par un membre de l'équipe SignalConso (chantage de la part du pro)"
    case EventActionValues.OtherReasonDeleteRequestReportDeletion:
      return "Suppression par un membre de l'équipe SignalConso (autre raison)"
    case EventActionValues.SolvedContractualDisputeReportDeletion:
      return "Résolution par un membre de l'équipe SignalConso (litige résolu)"
    case EventActionValues.ReportReOpenedByAdmin:
      return "Réouverture du signalement par un membre de l'équipe SignalConso"
    default:
      return action
  }
}
