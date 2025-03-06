import { ReportStatusPro, ReportUtils } from 'core/client/report/Report'

import { ReportStatus } from 'core/client/report/Report'
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
  return ReportUtils.closedStatus.includes(status)
}
export const isStatusInvisibleToPro = (status: ReportStatus): boolean => {
  return ReportUtils.invisibleToProStatus.includes(status)
}
