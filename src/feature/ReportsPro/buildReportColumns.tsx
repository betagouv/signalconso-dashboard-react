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

interface ReportTableColumnsParams {
  reportType: 'open' | 'closed'
  isMobileWidth: boolean
  css: typeof css
  i18nData: {
    formatDate: (d?: Date | undefined) => string
    m: typeof fr['messages']
  }
}

const getBoldText = (report: ReportSearchResult, content: React.ReactNode) => {
  if (report.report.status === ReportStatus.TraitementEnCours) {
    return <p className="font-bold">{content}</p>
  }
  return <p>{content}</p>
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
      render: (report: ReportSearchResult) => getBoldText(report, report.report.companySiret),
    },
    {
      id: 'createDate',
      head: 'Date de création',
      render: (report: ReportSearchResult) => getBoldText(report, formatDate(report.report.creationDate)),
    },
    {
      id: 'consumer',
      head: 'Consommateur',
      render: (report: ReportSearchResult) =>
        getBoldText(report, report.report.contactAgreement ? `${report.report.firstName} ${report.report.lastName}` : 'Anonyme'),
    },
  ]

  const specificColumns =
    reportType === 'open'
      ? [
          {
            id: 'expirationDate',
            head: 'À répondre avant le',
            render: (report: ReportSearchResult) => getBoldText(report, formatDate(report.report.expirationDate)),
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
            head: 'Réponse Professionnelle',
            render: (report: ReportSearchResult) => <ReportResponseDetails details={report.professionalResponse?.details} />,
          },
          {
            id: 'avisConso',
            head: 'Avis Consommateur',
            render: (report: ReportSearchResult) =>
              report.consumerReview && <ConsumerReviewLabel evaluation={report.consumerReview.evaluation} />,
          },
        ]

  return [...baseColumns, ...specificColumns]
}
