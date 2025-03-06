import {
  Report,
  ReportStatus,
  ReportStatusPro,
} from '../core/client/report/Report'
import { useConnectedContext } from '../core/context/connected/connectedContext'
import { useI18n } from '../core/i18n'
import { Label, LabelProps } from './Label'
import { reportStatusColor, reportStatusProColor } from './reportStatusUtils'

interface ReportStatusLabelProps extends Omit<LabelProps, 'children'> {
  status: ReportStatus
  isAdminClosure?: boolean
}

interface ReportStatusProLabelProps extends Omit<LabelProps, 'children'> {
  status: ReportStatusPro
}

export const ReportStatusLabel = ({
  status,
  isAdminClosure,
  ...props
}: ReportStatusLabelProps) => {
  const { connectedUser } = useConnectedContext()
  return connectedUser.isPro ? (
    <ReportStatusProLabel
      status={Report.getStatusProByStatus(status)}
      {...props}
    />
  ) : (
    <ReportStatusAdminLabel
      status={status}
      isAdminClosure={isAdminClosure}
      {...props}
    />
  )
}

const borderRadius = '10px'

const ReportStatusAdminLabel = ({
  status,
  isAdminClosure,
  style,
  ...props
}: ReportStatusLabelProps) => {
  const { m } = useI18n()
  return (
    <Label
      {...props}
      style={{
        color: 'white',
        background: reportStatusColor[status],
        borderRadius,
        ...style,
      }}
    >
      {isAdminClosure ? m.adminClosure : m.reportStatusShort[status]} &nbsp;
    </Label>
  )
}

const ReportStatusProLabel = ({
  status,
  style,
  ...props
}: ReportStatusProLabelProps) => {
  const { m } = useI18n()
  return (
    <Label
      {...props}
      style={{
        color: 'white',
        background: reportStatusProColor[status],
        borderRadius,
        ...style,
      }}
    >
      {m.reportStatusShortPro[status]}
    </Label>
  )
}
