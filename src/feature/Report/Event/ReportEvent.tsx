import React from 'react'
import {useI18n} from '../../../core/i18n'
import {ReportEventIcon} from './ReportEventIcon'
import {Box, Icon} from '@mui/material'
import {combineSx, styleUtils, sxUtils} from '../../../core/theme'
import {makeSx} from '../../../alexlibs/mui-extension'
import {EventActionValues, ReportEvent} from '../../../core/client/event/Event'

export interface ReportComponentEventProps {
  event: ReportEvent
}

const css = makeSx({
  root: {
    display: 'flex',
    mb: 1.5,
    '&:last-of-type': {
      mb: 0,
      '& $body': {
        border: 'none',
        pb: 0,
      },
    },
  },
  body: {
    flex: 1,
    pt: 0,
    pr: 2,
    pb: 1.5,
    pl: 0,
    fontSize: t => styleUtils(t).fontSize.small,
    borderBottom: t => '1px solid ' + t.palette.divider,
  },
  icon: {
    mt: 0,
    mr: 2,
    mb: 2,
    ml: 0,
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: t => t.typography.fontWeightBold,
    fontSize: t => styleUtils(t).fontSize.normal,
  },
  date: {
    whiteSpace: 'nowrap',
    color: t => t.palette.text.disabled,
    mt: 0.5,
  },
})

export const ReportEventComponent = ({event}: ReportComponentEventProps) => {
  const {formatDate, formatTime} = useI18n()

  return (
    <div className="grid grid-cols-[auto,auto,1fr] text-base border-b-[1px] last:border-b-0 border-solid border-0 border-gray-300 gap-x-4">
      <div className="p-2 flex items-center justify-center">
        <p className=" font-bold">
          {formatDate(event.data.creationDate)}{' '}
          <span className=" font-normal text-gray-500">à {formatTime(event.data.creationDate)}</span>
        </p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <ReportEventIcon action={event.data.action} />
      </div>
      <div className="flex flex-col p-2">
        {translateEventAction(event.data.action)}
        {event.user && (
          <div className="text-sm text-gray-500">
            <Icon className="!text-sm">person</Icon>
            &nbsp;
            <span className="">
              {event.user.firstName} {event.user.lastName} {event.user.role}
            </span>
          </div>
        )}
        <p className="text-sm text-gray-500">{(event.data.details as any)?.description}</p>
      </div>
    </div>
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
      return "Suppression par un membre de l'équipe SignalConso (litige résolu)"
    case EventActionValues.ReportReOpenedByAdmin:
      return "Réouverture du signalement par un membre de l'équipe SignalConso"
    default:
      return action
  }
}
