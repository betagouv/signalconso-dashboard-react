import {EventActionValues} from 'core/api'
import {Icon, Theme, useTheme} from '@material-ui/core'
import {utilsStyles} from '../../core/theme'

export interface ReportEventIconProps {
  action: EventActionValues
  className?: string
}

export const getReportEventIcon = (action: EventActionValues): string => {
  const icon = ({
    [EventActionValues.FirstVisit]: 'notifications',
    [EventActionValues.ReportResponse]: 'question_answer',
    [EventActionValues.PostalSend]: 'send',
    [EventActionValues.EditConsumer]: 'edit',
    [EventActionValues.EditCompany]: 'edit',
    [EventActionValues.Comment]: 'feedback',
    [EventActionValues.Control]: 'assignment_late',
    [EventActionValues.ConsumerAttachments]: 'attachment',
    [EventActionValues.ProfessionalAttachments]: 'attachment',
    'Avis du consommateur sur la réponse du professionnel': 'rate_review',
    'Signalement consulté ignoré': 'do_disturb_on'
  })[action]
  if (icon) {
    return icon
  }
  if (action.indexOf('Email ') > -1) {
    return 'email'
  }
  return 'notifications'
}

export const getReportEventColor = (t: Theme) => (action: EventActionValues): string => ({
  [EventActionValues.FirstVisit]: utilsStyles(t).color.info,
  [EventActionValues.ReportResponse]: utilsStyles(t).color.success,
  [EventActionValues.PostalSend]: utilsStyles(t).color.info,
  [EventActionValues.EditConsumer]: utilsStyles(t).color.info,
  [EventActionValues.EditCompany]: utilsStyles(t).color.info,
  [EventActionValues.Comment]: utilsStyles(t).color.info,
  [EventActionValues.Control]: t.palette.error.main,
  [EventActionValues.ConsumerAttachments]: t.palette.text.hint,
  [EventActionValues.ProfessionalAttachments]: t.palette.text.hint,
  'Avis du consommateur sur la réponse du professionnel': utilsStyles(t).color.success,
  'Signalement consulté ignoré': utilsStyles(t).color.error,
})[action] || t.palette.text.hint

export const ReportEventIcon = ({action, className}: ReportEventIconProps) => {
  const theme = useTheme()
  return (
    <Icon className={className} style={{color: getReportEventColor(theme)(action)}}>
      {getReportEventIcon(action)}
    </Icon>
  )
}
