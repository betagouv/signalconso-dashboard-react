import { ReportStatusPro, ReportUtils } from 'core/client/report/Report'

import { ReportStatus } from 'core/client/report/Report'
export const reportStatusColor = {
  [ReportStatus.NA]: '#767676',
  [ReportStatus.InformateurInterne]: '#767676',
  [ReportStatus.TraitementEnCours]: '#c75300',
  [ReportStatus.Transmis]: '#c75300',
  [ReportStatus.NonConsulte]: '#0003A2',
  [ReportStatus.MalAttribue]: '#0003A2',
  [ReportStatus.PromesseAction]: '#108a12',
  [ReportStatus.Infonde]: '#BC0015',
  [ReportStatus.ConsulteIgnore]: '#BC0015',
  [ReportStatus.SuppressionRGPD]: '#767676',
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
