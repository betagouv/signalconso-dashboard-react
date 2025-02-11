import { Label, LabelProps } from './Label'
import { useI18n } from '../core/i18n'
import { useConnectedContext } from '../core/context/ConnectedContext'
import {
  Report,
  ReportStatus,
  ReportStatusPro,
} from '../core/client/report/Report'
import { NavLink } from 'react-router'
import { siteMap } from '../core/siteMap'
import ReportSearchNavLink from '../feature/Report/ReportSearchNavLink'
import { Icon } from '@mui/material'

interface ReportStatusLabelProps extends Omit<LabelProps, 'children'> {
  status: ReportStatus
  isAdminClosure?: boolean
}

interface ReportStatusProLabelProps extends Omit<LabelProps, 'children'> {
  status: ReportStatusPro
}

export const reportStatusColor = {
  [ReportStatus.NA]: '#a1a1a1',
  [ReportStatus.InformateurInterne]: '#a1a1a1',
  [ReportStatus.TraitementEnCours]: '#e67e00',
  [ReportStatus.Transmis]: '#e67e00',
  [ReportStatus.NonConsulte]: '#3582A3FF',
  [ReportStatus.MalAttribue]: '#3582A3FF',
  [ReportStatus.PromesseAction]: '#4caf50',
  [ReportStatus.Infonde]: '#4caf50',
  [ReportStatus.ConsulteIgnore]: '#8B0000',
  [ReportStatus.SuppressionRGPD]: '#a1a1a1',
}

export const reportStatusProColor = {
  [ReportStatusPro.ARepondre]: '#d64d00',
  [ReportStatusPro.Cloture]: '#27a658',
}

export const isStatusFinal = (status: ReportStatus) => {
  return Report.closedStatus.includes(status)
}
export const isStatusInvisibleToPro = (status: ReportStatus): boolean => {
  return Report.invisibleToProStatus.includes(status)
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
