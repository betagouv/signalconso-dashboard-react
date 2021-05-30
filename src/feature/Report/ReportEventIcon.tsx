import {EventActionValues} from '@signalconso/signalconso-api-sdk-js/build'
import {Icon, Theme, useTheme} from '@material-ui/core'

export interface ReportEventIconProps {
  action: EventActionValues
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
  })[action]
  if (icon) {
    return icon
  }
  if (action.indexOf('Email ') > -1) {
    return 'email'
  }
  return ''
}

export const getReportEventColor = (t: Theme) => (action: EventActionValues): string => ({
  [EventActionValues.FirstVisit]: t.palette.primary.main,
  [EventActionValues.ReportResponse]: t.palette.primary.main,
  [EventActionValues.PostalSend]: t.palette.primary.main,
  [EventActionValues.EditConsumer]: t.palette.primary.main,
  [EventActionValues.EditCompany]: t.palette.primary.main,
  [EventActionValues.Comment]: t.palette.primary.main,
  [EventActionValues.Control]: t.palette.error.main,
  [EventActionValues.ConsumerAttachments]: t.palette.text.hint,
  [EventActionValues.ProfessionalAttachments]: t.palette.text.hint,
})[action]

export const ReportEventIcon = ({action}: ReportEventIconProps) => {
  const theme = useTheme()
  console.log({
    [EventActionValues.FirstVisit]: 'notifications',
    [EventActionValues.ReportResponse]: 'question_answer',
    [EventActionValues.PostalSend]: 'send',
    [EventActionValues.EditConsumer]: 'edit',
    [EventActionValues.EditCompany]: 'edit',
    [EventActionValues.Comment]: 'feedback',
    [EventActionValues.Control]: 'assignment_late',
    [EventActionValues.ConsumerAttachments]: 'attachment',
    [EventActionValues.ProfessionalAttachments]: 'attachment',
  })
  console.log('---action', action)
  return (
    <div>
      ({getReportEventIcon(action)})
      <Icon style={{color: getReportEventColor(theme)(action)}}>
        {getReportEventIcon(action)}
      </Icon>
    </div>
  )
}
