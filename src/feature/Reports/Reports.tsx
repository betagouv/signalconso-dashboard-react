import {useI18n} from '../../core/i18n'
import {Page, PageTitle} from '../../shared/Page'

import {Badge, Box, Checkbox, Chip, Collapse, Icon, Tooltip} from '@mui/material'
import React, {useEffect} from 'react'
import {NavLink} from 'react-router-dom'
import {Fender, IconBtn, Txt} from '../../alexlibs/mui-extension'
import {useSetState} from '../../alexlibs/react-hooks-lib'
import {EntityIcon} from '../../core/EntityIcon'
import {Report, ReportingDateLabel, ReportTag} from '../../core/client/report/Report'
import {useLogin} from '../../core/context/LoginContext'
import {cleanObject, textOverflowMiddleCropping} from '../../core/helper'
import compose from '../../core/helper/compose'
import {
  mapArrayFromQuerystring,
  mapBooleanFromQueryString,
  mapDateFromQueryString,
  mapDatesToQueryString,
  useQueryString,
} from '../../core/helper/useQueryString'
import {Id, ReportSearch, ResponseEvaluation} from '../../core/model'
import {siteMap} from '../../core/siteMap'
import {styleUtils, sxUtils} from '../../core/theme'
import {ScButton} from '../../shared/Button'
import {ConsumerReviewLabel} from '../../shared/ConsumerReviewLabel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Panel} from '../../shared/Panel'
import {ReportDetailValues} from '../../shared/ReportDetailValues'
import {ReportStatusLabel} from '../../shared/ReportStatus'
import {SelectTagsMenuValues} from '../../shared/SelectTags/SelectTagsMenu'
import {PanelBody} from 'alexlibs/mui-extension/Panel/PanelBody'
import {useMutation} from '@tanstack/react-query'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import SearchFilters from './ReportsFilter'
import AdvancedReportsFilter from './AdvancedReportsFilter'
import AdvancedSearchBar from './AdvancedSearchBar'
import CompanyNameDetails from './CompanyNameDetails'
import DatatableToolbarComponent from './DatatableToolbarComponent'
import ReportResponseDetails from './ReportResponseDetails'

interface ReportSearchQs {
  readonly departments?: string[] | string
  readonly tags?: ReportTag[] | ReportTag
  readonly companyCountries?: string[] | string
  readonly siretSirenList?: string[] | string
  readonly activityCodes?: string[] | string
  start?: string
  end?: string
  email?: string
  websiteURL?: string
  phone?: string
  category?: string
  status?: string[]
  details?: string
  hasWebsite?: boolean
  hasPhone?: boolean
  hasCompany?: boolean
  hasForeignCountry?: boolean
  hasEvaluation?: boolean
  evaluation?: ResponseEvaluation[]
  offset: number
  limit: number
}

export const Reports = () => {
  const {m, formatDate} = useI18n()
  const {connectedUser, apiSdk} = useLogin()
  const downloadReports = useMutation({mutationFn: apiSdk.secured.reports.download})
  const selectReport = useSetState<Id>()
  const [expanded, setExpanded] = React.useState(false)
  const queryString = useQueryString<Partial<ReportSearch>, Partial<ReportSearchQs>>({
    toQueryString: mapDatesToQueryString,
    fromQueryString: compose(
      mapDateFromQueryString,
      mapArrayFromQuerystring([
        'status',
        'departments',
        'tags',
        'companyCountries',
        'siretSirenList',
        'activityCodes',
        'evaluation',
      ]),
      mapBooleanFromQueryString(['hasCompany', 'hasForeignCountry', 'hasPhone', 'hasWebsite', 'hasEvaluation']),
    ),
  })

  const _reports = useReportSearchQuery({offset: 0, limit: 10, ...queryString.get()})

  useEffect(() => {
    queryString.update(cleanObject(_reports.filters))
  }, [_reports.filters])

  const getReportingDate = (report: Report) =>
    report.details.filter(_ => _.label.indexOf(ReportingDateLabel) !== -1).map(_ => _.value)

  const tags: SelectTagsMenuValues = {}
  _reports.filters.withTags?.forEach(tag => {
    tags[tag] = 'included'
  })
  _reports.filters.withoutTags?.forEach(tag => {
    tags[tag] = 'excluded'
  })
  return (
    <Page>
      <PageTitle>{m.reports_pageTitle}</PageTitle>
      <Panel elevation={3}>
        <PanelBody>
          <SearchFilters />
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <AdvancedReportsFilter />
          </Collapse>
        </PanelBody>
        <AdvancedSearchBar />
      </Panel>
      <Panel sx={{overflow: 'visible'}}>
        <Datatable
          id="reports"
          header={<DatatableToolbarComponent selectReport={selectReport} downloadReports={downloadReports} m={m} />}
          loading={_reports.result.isFetching}
          paginate={{
            offset: _reports.filters.offset,
            limit: _reports.filters.limit,
            onPaginationChange: pagination => _reports.updateFilters(prev => ({...prev, ...pagination})),
          }}
          getRenderRowKey={_ => _.report.id}
          data={_reports.result.data?.entities}
          total={_reports.result.data?.totalCount}
          showColumnsToggle={true}
          plainTextColumnsToggle={true}
          initialHiddenColumns={
            connectedUser.isDGCCRF ? ['companyPostalCode', 'companySiret', 'companyCountry', 'reportDate', 'status', 'file'] : []
          }
          columns={[
            {
              id: 'checkbox',
              head: (() => {
                const allChecked = selectReport.size === _reports.result.data?.entities.length
                return (
                  <Checkbox
                    disabled={_reports.result.isFetching}
                    indeterminate={selectReport.size > 0 && !allChecked}
                    checked={allChecked}
                    onChange={() => {
                      if (allChecked) {
                        selectReport.clear()
                      } else {
                        selectReport.add(_reports.result.data!.entities!.map(_ => _.report.id))
                      }
                    }}
                  />
                )
              })(),
              style: {width: 0},
              render: _ => <Checkbox checked={selectReport.has(_.report.id)} onChange={() => selectReport.toggle(_.report.id)} />,
            },
            {
              id: 'companyPostalCode',
              head: m.postalCodeShort,
              sx: _ => ({
                maxWidth: 76,
              }),
              render: _ => (
                <>
                  <span>{_.report.companyAddress.postalCode?.slice(0, 2)}</span>
                  <Box component="span" sx={{color: t => t.palette.text.disabled}}>
                    {_.report.companyAddress.postalCode?.substr(2, 5)}
                  </Box>
                </>
              ),
            },
            {
              id: 'companyName',
              head: m.company,
              sx: _ => ({
                lineHeight: 1.4,
                maxWidth: 170,
              }),
              render: _ => (
                <CompanyNameDetails
                  companyId={_.report.companyId}
                  isDGAL={connectedUser.isDGAL}
                  companyName={_.report.companyName}
                  companyBrand={_.report.companyBrand}
                />
              ),
            },
            {
              id: 'companySiret',
              head: m.siret,
              render: _ => (
                <>
                  {_.report.companyId && !connectedUser.isDGAL ? (
                    <NavLink to={siteMap.logged.company(_.report.companyId)}>
                      <Txt link sx={{marginBottom: '-1px'}}>
                        {_.report.companySiret}
                      </Txt>
                    </NavLink>
                  ) : (
                    <span>{_.report.companySiret}</span>
                  )}
                </>
              ),
            },
            {
              id: 'companyCountry',
              head: m.country,
              render: _ => _.report.companyAddress.country?.name,
            },
            {
              id: 'category',
              head: m.problem,
              sx: _ => ({
                maxWidth: 200,
              }),
              render: _ => (
                <Tooltip
                  title={
                    <>
                      <b>{m.ReportCategoryDesc[_.report.category]}</b>
                      <Box component="ul" sx={{m: 0, p: 2}}>
                        {_.report.subcategories.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </Box>
                    </>
                  }
                >
                  <span>{m.ReportCategoryDesc[_.report.category]}</span>
                </Tooltip>
              ),
            },
            {
              id: 'creationDate',
              head: m.creation,
              render: _ => formatDate(_.report.creationDate),
            },
            {
              id: 'reportDate',
              head: 'Date constat',
              render: _ => getReportingDate(_.report),
            },
            {
              id: 'details',
              head: m.details,
              sx: _ => ({
                fontSize: t => styleUtils(t).fontSize.small,
                color: t => t.palette.text.secondary,
                maxWidth: 200,
                minWidth: 200,
                lineHeight: 1.4,
                whiteSpace: 'initial',
              }),
              render: _ => <ReportDetailValues input={_.report.details} lines={2} />,
            },
            {
              id: 'tags',
              head: m.tags,
              render: _ =>
                _.report.tags.map(tag => (
                  <Chip
                    key={tag}
                    size="small"
                    variant="outlined"
                    label={m.reportTagDesc[tag]}
                    sx={{
                      fontWeight: t => t.typography.fontWeightBold,
                      color: t => t.palette.text.secondary,
                    }}
                    style={{marginRight: 2}}
                  />
                )),
            },
            {
              id: 'status',
              head: m.status,
              render: _ => <ReportStatusLabel dense status={_.report.status} />,
            },
            {
              id: 'email',
              head: m.consumer,
              sx: _ => ({
                maxWidth: 160,
              }),
              render: _ => (
                <span>
                  <Box
                    component="span"
                    sx={{
                      ...(_.report.contactAgreement
                        ? {
                            color: t => t.palette.success.light,
                          }
                        : {
                            color: t => t.palette.error.main,
                          }),
                    }}
                  >
                    {textOverflowMiddleCropping(_.report.email ?? '', 25)}
                  </Box>
                  <br />
                  <Txt color="hint" size="small">
                    {_.report.consumerPhone ?? ''}
                  </Txt>
                </span>
              ),
            },
            {
              id: 'proResponse',
              head: m.proResponse,
              render: _ => <ReportResponseDetails details={_.professionalResponse?.details} />,
            },
            {
              id: 'avisConso',
              head: m.consumerReviews,
              render: _ => (
                <>
                  {_.consumerReview && (
                    <Tooltip
                      title={
                        <>
                          <Box sx={{fontWeight: t => t.typography.fontWeightBold, fontSize: 'larger', mb: 1}}>
                            {m.responseEvaluationShort[_.consumerReview.evaluation]}
                          </Box>
                          <Box
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 20,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {_.consumerReview.details}
                          </Box>
                        </>
                      }
                    >
                      <ConsumerReviewLabel evaluation={_.consumerReview.evaluation} center />
                    </Tooltip>
                  )}
                </>
              ),
            },
            {
              id: 'dateAvisConso',
              head: "Date de l'avis Conso",
              render: _ => formatDate(_.consumerReview?.creationDate),
            },
            {
              id: 'file',
              head: m.files,
              sx: _ => ({
                minWidth: 44,
                maxWidth: 100,
              }),
              render: _ =>
                _.files.length > 0 && (
                  <Badge badgeContent={_.files.length} color="primary" invisible={_.files.length === 1}>
                    <Icon sx={{color: t => t.palette.text.disabled}}>insert_drive_file</Icon>
                  </Badge>
                ),
            },
            {
              id: 'actions',
              stickyEnd: true,
              sx: _ => sxUtils.tdActions,
              render: _ => (
                <NavLink to={siteMap.logged.report(_.report.id)}>
                  <IconBtn color="primary">
                    <Icon>chevron_right</Icon>
                  </IconBtn>
                </NavLink>
              ),
            },
          ]}
          renderEmptyState={
            <Fender
              icon={EntityIcon.report}
              title={m.noReportsTitle}
              description={
                <>
                  <Txt color="hint" size="big" block gutterBottom>
                    {m.noReportsDesc}
                  </Txt>
                  <ScButton icon="clear" onClick={_reports.clearFilters} variant="contained" color="primary">
                    {m.removeAllFilters}
                  </ScButton>
                </>
              }
            />
          }
        />
      </Panel>
    </Page>
  )
}
