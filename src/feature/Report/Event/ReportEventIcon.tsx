import {EventActionValues} from 'core/api'
import {Icon, Theme, useTheme} from '@material-ui/core'
import {utilsStyles} from '../../../core/theme'
import {fnSwitch} from '../../../core/helper/utils'

export interface ReportEventIconProps {
  action: EventActionValues
  className?: string
}

export const getReportEventIcon = (action: EventActionValues) => fnSwitch(action, {
    [EventActionValues.ReportReadingByPro]: 'notifications',
    [EventActionValues.ReportProResponse]: 'question_answer',
    [EventActionValues.ReportConsumerChange]: 'edit',
    [EventActionValues.ReportCompanyChange]: 'edit',
    [EventActionValues.Comment]: 'feedback',
    [EventActionValues.Control]: 'assignment_late',
    [EventActionValues.ConsumerAttachments]: 'attachment',
    [EventActionValues.ProfessionalAttachments]: 'attachment',
    [EventActionValues.ReportReviewOnResponse]: 'rate_review',
    [EventActionValues.ReportClosedByNoAction]: 'do_disturb_on',
    [EventActionValues.Creation]: 'add_alert',
  }, _ => {
    const toLower = _.toLowerCase()
    return toLower.indexOf('email') > -1 ? 'email' : toLower.indexOf('courrier') ? 'send' : 'notifications'
  }
)

export const getReportEventColor = (t: Theme) => (action: EventActionValues) => fnSwitch(action, {
  [EventActionValues.ReportReadingByPro]: utilsStyles(t).color.info,
  [EventActionValues.ReportProResponse]: utilsStyles(t).color.success,
  [EventActionValues.ReportConsumerChange]: utilsStyles(t).color.info,
  [EventActionValues.ReportCompanyChange]: utilsStyles(t).color.info,
  [EventActionValues.Comment]: utilsStyles(t).color.info,
  [EventActionValues.Control]: t.palette.error.main,
  [EventActionValues.ConsumerAttachments]: t.palette.text.hint,
  [EventActionValues.ProfessionalAttachments]: t.palette.text.hint,
  [EventActionValues.ReportReviewOnResponse]: utilsStyles(t).color.success,
  [EventActionValues.ReportClosedByNoAction]: utilsStyles(t).color.error,
  [EventActionValues.Creation]: utilsStyles(t).color.info,
}, _ => t.palette.text.hint)

export const ReportEventIcon = ({action, className}: ReportEventIconProps) => {
  const theme = useTheme()
  return (
    <Icon className={className} style={{color: getReportEventColor(theme)(action)}}>
      {getReportEventIcon(action)}
    </Icon>
  )
}
