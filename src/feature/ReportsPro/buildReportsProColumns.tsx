/* eslint-disable react-refresh/only-export-components */
import { Badge, Box, Button, Icon } from '@mui/material'
import { ButtonProps } from '@mui/material/Button'
import { createLink, LinkComponent } from '@tanstack/react-router'
import { fr } from 'core/i18n/fr'
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
import { combineSx, styleUtils, sxUtils } from '../../core/theme'
import { UserNameLabel } from '../../shared/UserNameLabel'
import { CheckboxColumn, CheckboxColumnHead } from '../Reports/reportsColumns'

interface ReportTableColumnsParams {
  _reports: UseQueryPaginateResult<
    ReportSearch & PaginatedFilters,
    Paginate<ReportSearchResult>,
    unknown
  >
  selectReport: UseSetState<string>
  reportType: 'open' | 'closed'
  isMobileWidth: boolean
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
  i18nData,
}: ReportTableColumnsParams) => {
  const { formatDate, m } = i18nData

  const emptyCell = <span className="text-gray-500">—</span>
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
          <div className="py-2 flex flex-col gap-2">
            <div className="flex justify-between">
              <ReportStatusLabel dense status={_.report.status} />
              <SeeReportButton report={_} />
            </div>
            <Box
              sx={{
                fontSize: (t) => styleUtils(t).fontSize.normal,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1 / 2,
                  }}
                >
                  <Txt bold size="big">
                    {_.report.companySiret}
                  </Txt>
                  <Icon
                    sx={combineSx(
                      {
                        my: 0,
                        mx: 1,
                      },
                      sxUtils.inlineIcon,
                    )}
                  >
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
            </Box>
          </div>
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
      id: 'creationDate',
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
      render: (report: ReportSearchResult) =>
        report.assignedUser ? (
          <UserNameLabel
            firstName={report.assignedUser.firstName}
            lastName={report.assignedUser.lastName}
          />
        ) : (
          emptyCell
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
              report.files.length > 0 ? (
                <Badge badgeContent={report.files.length} color="primary">
                  <Icon>insert_drive_file</Icon>
                </Badge>
              ) : (
                emptyCell
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

  const finalColumns = [
    {
      id: 'see',
      render: (report: ReportSearchResult) => (
        <SeeReportButton {...{ report }} />
      ),
    },
  ]

  return [...baseColumns, ...specificColumns, ...finalColumns]
}

// Creating custom link (wrapper around our own component : SeeReportButton) to add typesafety to routing
// https://tanstack.com/router/latest/docs/framework/react/guide/custom-link
const MUILinkComponent = React.forwardRef<
  HTMLAnchorElement,
  Omit<ButtonProps, 'href'>
>((props, ref) => {
  return (
    <Button
      component="a"
      ref={ref}
      variant="text"
      className="!normal-case"
      endIcon={<Icon>visibility</Icon>}
      {...props}
    >
      Voir
    </Button>
  )
})

const CreatedLinkComponent = createLink(MUILinkComponent)

const CustomLink: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />
}

function SeeReportButton({ report }: { report: ReportSearchResult }) {
  return (
    <CustomLink
      to="/suivi-des-signalements/report/$reportId"
      params={{ reportId: report.report.id }}
    />
  )
}
