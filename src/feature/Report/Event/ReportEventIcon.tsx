import { Icon, IconProps, Theme, useTheme } from '@mui/material'
import { styleUtils } from '../../../core/theme'
import { EventActionValues } from '../../../core/client/event/Event'
import { fnSwitch } from '../../../alexlibs/ts-utils'

interface ReportEventIconProps {
  action: EventActionValues
}

const getReportEventIcon = (action: EventActionValues) =>
  fnSwitch(
    action,
    {
      [EventActionValues.ReportReadingByPro]: 'notifications',
      [EventActionValues.ReportProResponse]: 'question_answer',
      [EventActionValues.ReportProEngagementHonoured]: 'check',
      [EventActionValues.ReportConsumerChange]: 'edit',
      [EventActionValues.ReportCompanyChange]: 'edit',
      [EventActionValues.Comment]: 'feedback',
      [EventActionValues.Control]: 'assignment_late',
      [EventActionValues.ConsumerAttachments]: 'attachment',
      [EventActionValues.ProfessionalAttachments]: 'attachment',
      [EventActionValues.ReportReviewOnResponse]: 'rate_review',
      [EventActionValues.ReportClosedByNoAction]: 'do_disturb_on',
      [EventActionValues.Creation]: 'add_alert',
      [EventActionValues.ReportAffectedToUser]: 'person_add',
    },
    (_) => {
      const toLower = _.toLowerCase()
      return toLower.indexOf('email') > -1
        ? 'email'
        : toLower.indexOf('courrier')
          ? 'send'
          : 'notifications'
    },
  )

const getReportEventColor = (t: Theme) => (action: EventActionValues) =>
  fnSwitch(
    action,
    {
      [EventActionValues.ReportReadingByPro]: styleUtils(t).color.info,
      [EventActionValues.ReportProResponse]: styleUtils(t).color.success,
      [EventActionValues.ReportProEngagementHonoured]:
        styleUtils(t).color.success,
      [EventActionValues.ReportConsumerChange]: styleUtils(t).color.info,
      [EventActionValues.ReportCompanyChange]: styleUtils(t).color.info,
      [EventActionValues.Comment]: styleUtils(t).color.info,
      [EventActionValues.Control]: t.palette.error.main,
      [EventActionValues.ConsumerAttachments]: t.palette.text.disabled,
      [EventActionValues.ProfessionalAttachments]: t.palette.text.disabled,
      [EventActionValues.ReportReviewOnResponse]: styleUtils(t).color.success,
      [EventActionValues.ReportClosedByNoAction]: styleUtils(t).color.error,
      [EventActionValues.Creation]: styleUtils(t).color.info,
    },
    (_) => t.palette.text.disabled,
  )

export const ReportEventIcon = ({ action }: ReportEventIconProps) => {
  const theme = useTheme()
  return (
    <Icon style={{ color: getReportEventColor(theme)(action) }}>
      {getReportEventIcon(action)}
    </Icon>
  )
}
