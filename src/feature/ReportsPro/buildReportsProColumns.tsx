import { Badge, Box, Icon } from '@mui/material'
import { fr } from 'core/i18n/localization/fr'
import { ReportResponseDetails } from 'feature/Reports/ReportResponseDetails'
import React from 'react'
import { ReportStatusLabel } from 'shared/ReportStatus'
import { ConsumerReviewLabels } from 'shared/reviews/ConsumerReviewLabels'
import { Txt } from '../../alexlibs/mui-extension'
import { UseSetState } from '../../alexlibs/react-hooks-lib'
import {
  ReportSearchResult,
  ReportStatus,
} from '../../core/client/report/Report'
import { ReportSearch } from '../../core/client/report/ReportSearch'
import { Paginate, PaginatedFilters } from '../../core/model'
import { UseQueryPaginateResult } from '../../core/queryhooks/UseQueryPaginate'
import { combineSx, sxUtils } from '../../core/theme'
import { UserNameLabel } from '../../shared/UserNameLabel'
import { CheckboxColumn, CheckboxColumnHead } from '../Reports/reportsColumns'
import { css } from './ReportsPro'

interface ReportTableColumnsParams {
  _reports: UseQueryPaginateResult<
    ReportSearch & PaginatedFilters,
    Paginate<ReportSearchResult>,
    unknown
  >
  selectReport: UseSetState<string>
  reportType: 'open' | 'closed'
  isMobileWidth: boolean
  css: typeof css
  i18nData: {
    formatDate: (d?: Date | undefined) => string
    m: (typeof fr)['messages']
  }
}

const MaybeBold: React.FC<{
  report: ReportSearchResult
  children: React.ReactNode
}> = ({ report, children }) => {
  if (report.report.status === ReportStatus.TraitementEnCours) {
    return <p className="font-bold">{children}</p>
  }
  return <p>{children}</p>
}

export const buildReportsProColumns = ({
  _reports,
  selectReport,
  reportType,
  isMobileWidth,
  css,
  i18nData,
}: ReportTableColumnsParams) => {
  const { formatDate, m } = i18nData

  const includeCheckboxColumn = selectReport.size > 0
  const checkboxColumn = {
    alwaysVisible: true,
    id: 'download-checkbox',
    head: (() => <CheckboxColumnHead {...{ _reports, selectReport }} />)(),
    style: { width: 0 },
    render: (r: ReportSearchResult) => (
      <CheckboxColumn
        //Important do not remove, used to check if the click on table should redirect to report or not
        id={`download-checkbox-${r.report.id}`}
        {...{ r, selectReport }}
      />
    ),
  }
  if (isMobileWidth) {
    return [
      ...(includeCheckboxColumn ? [checkboxColumn] : []),
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
                <Icon sx={combineSx(css.iconDash, sxUtils.inlineIcon)}>
                  remove
                </Icon>
                <Txt color="disabled">
                  <Icon sx={sxUtils.inlineIcon}>location_on</Icon>
                  {_.report.companyAddress.postalCode}
                </Txt>
              </Box>
              <Txt block color="hint">
                {m.thisDate(formatDate(_.report.creationDate))}
              </Txt>
              <Txt block color="hint">
                {_.report.contactAgreement
                  ? m.byHim(_.report.firstName + ' ' + _.report.lastName)
                  : m.anonymousReport}
              </Txt>
            </Box>
            <ReportStatusLabel dense status={_.report.status} />
          </Box>
        ),
      },
    ]
  }

  const baseColumns = [
    ...(includeCheckboxColumn ? [checkboxColumn] : []),
    {
      id: 'siret',
      head: 'SIRET',
      render: (report: ReportSearchResult) => (
        <MaybeBold report={report}>{report.report.companySiret}</MaybeBold>
      ),
    },
    {
      id: 'createDate',
      head: 'Date de création',
      render: (report: ReportSearchResult) => (
        <MaybeBold report={report}>
          {formatDate(report.report.creationDate)}
        </MaybeBold>
      ),
    },
    {
      id: 'assignee',
      head: 'Affecté à',
      render: (report: ReportSearchResult) => (
        <UserNameLabel
          firstName={report.assignedUser?.firstName}
          lastName={report.assignedUser?.lastName}
        />
      ),
    },
    {
      id: 'consumer',
      head: 'Consommateur',
      render: (report: ReportSearchResult) => (
        <MaybeBold report={report}>
          <UserNameLabel
            firstName={report.report.firstName}
            lastName={report.report.lastName}
            missingLabel="Anonyme"
          />
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
              <MaybeBold report={report}>
                {formatDate(report.report.expirationDate)}
              </MaybeBold>
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
              <ReportResponseDetails
                details={report.professionalResponse?.event.details}
              />
            ),
          },
          {
            id: 'avisConso',
            head: 'Avis Consommateur',
            render: (report: ReportSearchResult) => (
              <ConsumerReviewLabels {...{ report }} detailsTooltip={false} />
            ),
          },
          {
            id: 'answerer',
            head: 'Répondant',
            render: (report: ReportSearchResult) =>
              report.professionalResponse &&
              report.professionalResponse.user && (
                <UserNameLabel
                  firstName={report.professionalResponse.user.firstName}
                  lastName={report.professionalResponse.user.lastName}
                />
              ),
          },
        ]

  return [...baseColumns, ...specificColumns]
}
