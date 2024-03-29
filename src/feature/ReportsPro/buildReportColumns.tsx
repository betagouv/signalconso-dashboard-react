import React from 'react'
import {Badge, Box, Icon} from '@mui/material'
import {ReportSearchResult, ReportStatus} from '../../core/client/report/Report'
import {Txt} from '../../alexlibs/mui-extension'
import {useI18n} from 'core/i18n'
import {ReportStatusLabel} from 'shared/ReportStatus'
import {combineSx, sxUtils} from '../../core/theme'
import {ConsumerReviewLabel} from 'shared/ConsumerReviewLabel'
import ReportResponseDetails from 'feature/Reports/ReportResponseDetails'
import {css} from './ReportsPro'
import {fr} from 'core/i18n/localization/fr'
import {config} from 'conf/config'

interface ReportTableColumnsParams {
  reportType: 'open' | 'closed'
  isMobileWidth: boolean
  css: typeof css
  i18nData: {
    formatDate: (d?: Date | undefined) => string
    m: typeof fr['messages']
  }
}

const MaybeBold: React.FC<{report: ReportSearchResult; children: React.ReactNode}> = ({report, children}) => {
  if (report.report.status === ReportStatus.TraitementEnCours) {
    return <p className="font-bold">{children}</p>
  }
  return <p>{children}</p>
}

export const buildReportColumns = ({reportType, isMobileWidth, css, i18nData}: ReportTableColumnsParams) => {
  const {formatDate, m} = i18nData

  if (isMobileWidth) {
    return [
      {
        id: 'all',
        head: '',
        render: (_: ReportSearchResult) => (
          <Box sx={css.card}>
            <Box sx={css.card_content}>
              <Box sx={css.card_head}>
                <Txt bold size="big">
                  {_.report.companySiret}
                </Txt>
                <Icon sx={combineSx(css.iconDash, sxUtils.inlineIcon)}>remove</Icon>
                <Txt color="disabled">
                  <Icon sx={sxUtils.inlineIcon}>location_on</Icon>
                  {_.report.companyAddress.postalCode}
                </Txt>
              </Box>
              <Txt block color="hint">
                {m.thisDate(formatDate(_.report.creationDate))}
              </Txt>
              <Txt block color="hint">
                {_.report.contactAgreement ? m.byHim(_.report.firstName + ' ' + _.report.lastName) : m.anonymousReport}
              </Txt>
            </Box>
            <ReportStatusLabel dense status={_.report.status} />
          </Box>
        ),
      },
    ]
  }

  const baseColumns = [
    {
      id: 'siret',
      head: 'SIRET',
      render: (report: ReportSearchResult) => <MaybeBold report={report}>{report.report.companySiret}</MaybeBold>,
    },
    {
      id: 'createDate',
      head: 'Date de création',
      render: (report: ReportSearchResult) => <MaybeBold report={report}>{formatDate(report.report.creationDate)}</MaybeBold>,
    },
    ...(config.showReportAssignement
      ? [
          {
            id: 'assignee',
            head: 'Assigné à',
            render: (report: ReportSearchResult) =>
              report.assignedUser ? `${report.assignedUser.firstName} ${report.assignedUser.lastName}` : null,
          },
        ]
      : []),
    {
      id: 'consumer',
      head: 'Consommateur',
      render: (report: ReportSearchResult) => (
        <MaybeBold report={report}>
          {report.report.contactAgreement ? `${report.report.firstName} ${report.report.lastName}` : 'Anonyme'}
        </MaybeBold>
      ),
    },
  ]

  const specificColumns =
    reportType === 'open'
      ? [
          {
            id: 'expirationDate',
            head: 'À répondre avant le',
            render: (report: ReportSearchResult) => (
              <MaybeBold report={report}>{formatDate(report.report.expirationDate)}</MaybeBold>
            ),
          },

          {
            id: 'file',
            head: 'Fichiers',
            render: (report: ReportSearchResult) =>
              report.files.length > 0 && (
                <Badge badgeContent={report.files.length} color="primary">
                  <Icon>insert_drive_file</Icon>
                </Badge>
              ),
          },
        ]
      : [
          {
            id: 'proResponse',
            head: 'Réponse du professionnel',
            render: (report: ReportSearchResult) => (
              <ReportResponseDetails details={report.professionalResponse?.event.details} />
            ),
          },
          {
            id: 'avisConso',
            head: 'Avis Consommateur',
            render: (report: ReportSearchResult) =>
              report.consumerReview && <ConsumerReviewLabel evaluation={report.consumerReview.evaluation} />,
          },
          {
            id: 'answerer',
            head: 'Répondant',
            render: (report: ReportSearchResult) =>
              report.professionalResponse &&
              report.professionalResponse.user && (
                <div>
                  {' '}
                  ${report.report.firstName} ${report.report.lastName}`
                </div>
              ),
          },
        ]

  return [...baseColumns, ...specificColumns]
}
