import {Label, LabelProps} from './Label'
import {useI18n} from '../core/i18n'
import {useLogin} from '../core/context/LoginContext'
import {Report, ReportStatus, ReportStatusPro} from '../core/client/report/Report'

interface ReportStatusLabelProps extends Omit<LabelProps, 'children'> {
  status: ReportStatus
}

interface ReportStatusProLabelProps extends Omit<LabelProps, 'children'> {
  status: ReportStatusPro
}

export const reportStatusColor = {
  [ReportStatus.NA]: '#a1a1a1',
  [ReportStatus.LanceurAlerte]: '#a1a1a1',
  [ReportStatus.TraitementEnCours]: '#e67e00',
  [ReportStatus.Transmis]: '#e67e00',
  [ReportStatus.NonConsulte]: '#3582A3FF',
  [ReportStatus.MalAttribue]: '#3582A3FF',
  [ReportStatus.PromesseAction]: '#4caf50',
  [ReportStatus.Infonde]: '#4caf50',
  [ReportStatus.ConsulteIgnore]: '#8B0000',
}

export const reportStatusProColor = {
  [ReportStatusPro.ARepondre]: '#e67e00',
  [ReportStatusPro.NonConsulte]: '#8B0000',
  [ReportStatusPro.Cloture]: '#3582A3FF',
}

const statusInvisibleToPro = [ReportStatus.NA, ReportStatus.LanceurAlerte]
const statusWithProResponse = [ReportStatus.PromesseAction, ReportStatus.Infonde, ReportStatus.ConsulteIgnore]
const statusClosedBySystem = [ReportStatus.NonConsulte, ReportStatus.ConsulteIgnore]
const finalStatus = [...statusWithProResponse, ...statusClosedBySystem]

export const isStatusFinal = (status: ReportStatus): Boolean => {
  return finalStatus.includes(status)
}
export const isStatusInvisibleToPro = (status: ReportStatus): Boolean => {
  return statusInvisibleToPro.includes(status)
}

export const ReportStatusLabel = ({status, ...props}: ReportStatusLabelProps) => {
  const {connectedUser} = useLogin()
  return connectedUser.isPro ? (
    <ReportStatusProLabel status={Report.getStatusProByStatus(status)} {...props} />
  ) : (
    <ReportStatusAdminLabel status={status} {...props} />
  )
}

const borderRadius = '10px'

export const ReportStatusAdminLabel = ({status, style, ...props}: ReportStatusLabelProps) => {
  const {m} = useI18n()
  return (
    <Label {...props} style={{color: 'white', background: reportStatusColor[status], borderRadius, ...style}}>
      {m.reportStatusShort[status]}
    </Label>
  )
}

export const ReportStatusProLabel = ({status, style, ...props}: ReportStatusProLabelProps) => {
  const {m} = useI18n()
  return (
    <Label {...props} style={{color: 'white', background: reportStatusProColor[status], borderRadius, ...style}}>
      {m.reportStatusShortPro[status]}
    </Label>
  )
}
