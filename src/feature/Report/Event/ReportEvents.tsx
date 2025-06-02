import { Icon } from '@mui/material'
import { Fender } from '../../../alexlibs/mui-extension'
import {
  EventActionValues,
  EventWithUser,
} from '../../../core/client/event/Event'
import { useI18n } from '../../../core/i18n'
import { ReportEventIcon } from './ReportEventIcon'
import { UserNameLabel } from '../../../shared/UserNameLabel'
import { Link } from '@tanstack/react-router'

interface Props {
  events?: EventWithUser[]
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
                  a.event.creationDate.getTime() -
                  b.event.creationDate.getTime(),
              )
              .map((eventWithUser) => (
                <ReportEventComponent
                  key={eventWithUser.event.id}
                  eventWithUser={eventWithUser}
                />
              ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const ReportEventComponent = ({
  eventWithUser,
}: {
  eventWithUser: EventWithUser
}) => {
  const { formatDate, formatTime } = useI18n()

  return (
    <tr className="text-base border-b last:border-b-0 border-solid border-0 border-gray-300">
      <td className="p-2 w-26">
        <p className="font-bold">
          {formatDate(eventWithUser.event.creationDate)}{' '}
          <span className=" font-normal text-gray-500">
            à {formatTime(eventWithUser.event.creationDate)}
          </span>
        </p>
      </td>
      <td className="p-2  w-10">
        <ReportEventIcon action={eventWithUser.event.action} />
      </td>
      <td className="p-2 ">
        {translateEventAction(eventWithUser.event.action)}
        {eventWithUser.user && (
          <div className="text-sm text-gray-500">
            <Icon className="text-sm!">person</Icon>
            &nbsp;
            <span className="">
              <UserNameLabel
                lastName={eventWithUser.user.lastName}
                firstName={eventWithUser.user.firstName}
              />{' '}
              {eventWithUser.user.role}
            </span>
          </div>
        )}
        {eventWithUser.event.action === EventActionValues.UserAccessCreated && (
          <p className="text-sm text-gray-500">
            Utilisateur concerné : {(eventWithUser.event.details as any)?.email}{' '}
            ({(eventWithUser.event.details as any)?.level})
          </p>
        )}
        {eventWithUser.event.action === EventActionValues.UserAccessRemoved && (
          <p className="text-sm text-gray-500">
            Utilisateur impacté : {(eventWithUser.event.details as any)?.email}
          </p>
        )}
        <p className="text-sm text-gray-500">
          {(eventWithUser.event.details as any)?.description}
        </p>
        {(eventWithUser.event.details as any)?.comment && (
          <div className={'  mt-1  flex-row'}>
            <span className="text-sm text-black">Commentaire :</span>
            <p className="text-sm text-blue-600">
              {(eventWithUser.event.details as any)?.comment}
            </p>
          </div>
        )}
        {eventWithUser.event.action === EventActionValues.Reattribution && (
          <div className="flex flex-col">
            <Link
              className="text-sm text-gray-500"
              to="/suivi-des-signalements/report/$reportId"
              params={{
                reportId: (eventWithUser.event.details as any)?.newReportId,
              }}
            >
              Voir le nouveau signalement
            </Link>
            <Link
              className="text-sm text-gray-500"
              to="/entreprise/$companyId/bilan"
              params={{
                companyId: (eventWithUser.event.details as any)?.newCompanyId,
              }}
            >
              Voir la nouvelle entreprise
            </Link>
          </div>
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
