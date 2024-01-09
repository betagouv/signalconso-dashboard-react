import {Badge, Box, Grid, Icon, MenuItem} from '@mui/material'
import React, {useEffect, useMemo} from 'react'
import {Alert, Btn, Fender, Txt, makeSx} from '../../alexlibs/mui-extension'
import {useI18n} from '../../core/i18n'
import {Datatable, DatatableProps} from '../../shared/Datatable/Datatable'
import {Page, PageTitle} from '../../shared/Page'
import {Panel, PanelBody} from '../../shared/Panel'
import {ReportStatusLabel, ReportStatusProLabel} from '../../shared/ReportStatus'

import {ScOption} from 'core/helper/ScOption'
import {CompanyWithAccessLevel, Paginate, PaginatedFilters} from 'core/model'
import {UseQueryPaginateResult} from 'core/queryhooks/UseQueryPaginate'
import {useHistory} from 'react-router'
import {DebouncedInput} from 'shared/DebouncedInput'
import {Enum} from '../../alexlibs/ts-utils'
import {config} from '../../conf/config'
import {EntityIcon} from '../../core/EntityIcon'
import {Report, ReportSearchResult, ReportStatus, ReportStatusPro, ReportType} from '../../core/client/report/Report'
import {ReportSearch} from '../../core/client/report/ReportSearch'
import {cleanObject, openInNew} from '../../core/helper'
import compose from '../../core/helper/compose'
import {
  mapArrayFromQuerystring,
  mapDateFromQueryString,
  mapDatesToQueryString,
  useQueryString,
} from '../../core/helper/useQueryString'
import {useGetAccessibleByProQuery} from '../../core/queryhooks/companyQueryHooks'
import {useReportSearchQuery} from '../../core/queryhooks/reportQueryHooks'
import {siteMap} from '../../core/siteMap'
import {combineSx, styleUtils, sxUtils} from '../../core/theme'
import {ScButton} from '../../shared/Button'
import {ExportReportsPopper} from '../../shared/ExportPopperBtn'
import {Label} from '../../shared/Label'
import {PeriodPicker} from '../../shared/PeriodPicker'
import {ScInput} from '../../shared/ScInput'
import {ScSelect} from '../../shared/Select/Select'
import {SelectCompaniesByPro} from '../../shared/SelectCompaniesByPro/SelectCompaniesByPro'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'

type ReportsProResult = UseQueryPaginateResult<ReportSearch & PaginatedFilters, Paginate<ReportSearchResult>, unknown>

type ReportProColumnProps = {reportSearchResult: ReportSearchResult}

const css = makeSx({
  iconDash: {
    my: 0,
    mx: 1,
  },
  card_head: {
    display: 'flex',
    alignItems: 'center',
    mb: 1 / 2,
  },
  filters: {
    mb: 3,
  },
  filtersBody: {
    pb: t => `${t.spacing(1)} !important`,
  },
  actions: {
    flexWrap: 'wrap',
    whiteSpace: 'nowrap',
    mt: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    '& > *': {
      mb: 1,
      ml: 1,
    },
  },
})

const minRowsBeforeDisplayFilters = 2

function hasExpired(date: Date): Boolean {
  return date.getTime() < Date.now()
}

function expiresSoon(date: Date): Boolean {
  let now = new Date()
  let nowPlus10Days = now.setDate(now.getDate() + 7)
  return date.getTime() > Date.now() && date.getTime() < nowPlus10Days
}

interface ReportFiltersQs {
  readonly departments?: string[] | string
  readonly siretSirenList?: string[] | string
  start?: string
  end?: string
  status?: string[]
}

export const ReportsPro = () => {
  const queryString = useQueryString<Partial<ReportSearch>, Partial<ReportFiltersQs>>({
    toQueryString: mapDatesToQueryString,
    fromQueryString: compose(mapDateFromQueryString, mapArrayFromQuerystring(['status', 'siretSirenList', 'departments'])),
  })
  const _reports = useReportSearchQuery({offset: 0, limit: 10, ...queryString.get()})
  const _accessibleByPro = useGetAccessibleByProQuery()
  const history = useHistory()
  const {formatDate, m} = useI18n()

  const hasFilters = useMemo(() => {
    const {limit, offset, ...values} = _reports.filters
    return Object.keys(cleanObject(values)).length > 0 || offset > 0
  }, [_reports.filters])

  useEffect(() => {
    queryString.update(cleanObject(_reports.filters))
  }, [_reports.filters])

  const dataTablePaginate: DatatableProps<ReportSearchResult>['paginate'] = {
    minRowsBeforeDisplay: minRowsBeforeDisplayFilters,
    offset: _reports.filters.offset,
    limit: _reports.filters.limit,
    onPaginationChange: pagination => _reports.updateFilters(prev => ({...prev, ...pagination})),
  }

  function onClickRows(_: ReportSearchResult, e: React.MouseEvent) {
    const url = siteMap.logged.report(_.report.id)
    if (e.metaKey || e.ctrlKey) {
      openInNew(url)
    } else {
      history.push(url)
    }
  }

  return (
    <Page size="xl" loading={_accessibleByPro.isLoading}>
      <ReportProPageTitle />
      <AccountJustActivatedAlert {...{_reports, hasFilters}} />
      {ScOption.from(_accessibleByPro.data)
        .map(_accessibleByProData => (
          <>
            <ReportsProFilters {...{_reports, hasFilters, _accessibleByProData}} />
            <Panel>
              <Datatable<ReportSearchResult>
                id="reportspro"
                paginate={dataTablePaginate}
                data={_reports.result.data?.entities}
                loading={_accessibleByPro.isLoading}
                total={_reports.result.data?.totalCount}
                onClickRows={onClickRows}
                columns={[
                  {
                    id: 'all',
                    head: '',
                    render: _ => <ReportsProMobileSingleColumn reportSearchResult={_} />,
                  },
                ]}
                renderEmptyState={<ReportsProEmptyState {...{_reports, hasFilters}} />}
              />
            </Panel>
          </>
        ))
        .toUndefined()}
    </Page>
  )
}

function ReportProDesktopExpirationColumn({reportSearchResult}: ReportProColumnProps) {
  const _ = reportSearchResult
  const {m, formatDate} = useI18n()
  return (
    <>
      {expiresSoon(_.report.expirationDate) && !Report.isClosed(_.report.status) ? (
        <Label style={{color: 'white', background: 'darkred'}}>{m.warnExpireOn(formatDate(_.report.expirationDate))}</Label>
      ) : hasExpired(_.report.expirationDate) ? (
        <Label style={{color: '#777', background: 'white'}}>{formatDate(_.report.expirationDate)}</Label>
      ) : (
        <Label style={{color: 'black', background: 'white'}}>{formatDate(_.report.expirationDate)}</Label>
      )}
    </>
  )
}

function ReportProDesktopConsumerColumn({reportSearchResult}: ReportProColumnProps) {
  const _ = reportSearchResult
  const {m} = useI18n()
  return <>{_.report.contactAgreement ? _.report.firstName + ' ' + _.report.lastName : m.anonymousReport}</>
}

function ReportsProDesktopFileColumn({reportSearchResult}: ReportProColumnProps) {
  return reportSearchResult.files.length > 0 ? (
    <Badge badgeContent={reportSearchResult.files.length} color="primary" invisible={reportSearchResult.files.length === 1}>
      <Icon sx={{color: t => t.palette.text.disabled}}>insert_drive_file</Icon>
    </Badge>
  ) : null
}

function ReportsProMobileSingleColumn({reportSearchResult}: ReportProColumnProps) {
  const {m, formatDate} = useI18n()
  return (
    <div className="flex items-center p-2 ">
      <div className="grow">
        <div className="space-x-2">
          <span className="text-lg text-black font-bold">{reportSearchResult.report.companySiret}</span>
          <span>—</span>
          <span className="">
            <i className="ri-map-pin-2-fill text-gray-400" />
            {reportSearchResult.report.companyAddress.postalCode}
          </span>
        </div>
        <span className="block">{m.thisDate(formatDate(reportSearchResult.report.creationDate))}</span>
        <span className="block">
          {reportSearchResult.report.contactAgreement
            ? m.byHim(reportSearchResult.report.firstName + ' ' + reportSearchResult.report.lastName)
            : m.anonymousReport}
        </span>
      </div>
      <ReportStatusLabel dense status={reportSearchResult.report.status} />
    </div>
  )
}

function ReportsProEmptyState({_reports, hasFilters}: {_reports: ReportsProResult; hasFilters: boolean}) {
  const {m} = useI18n()
  return (
    <Fender
      icon={EntityIcon.report}
      title={m.noReportsTitle}
      description={
        <>
          <Txt color="hint" size="big" block gutterBottom>
            {hasFilters ? m.noReportsWithFiltersDesc : m.noReportsFound}
          </Txt>
          {hasFilters && (
            <ScButton icon="clear" onClick={_reports.clearFilters} variant="contained" color="primary">
              {m.removeAllFilters}
            </ScButton>
          )}
        </>
      }
    />
  )
}

function ReportsProFilters({
  _reports,
  hasFilters,
  _accessibleByProData,
}: {
  _reports: ReportsProResult
  hasFilters: boolean
  _accessibleByProData: CompanyWithAccessLevel[]
}) {
  const {m} = useI18n()

  const displayFilters = useMemo(
    () => (_reports.result.data && _reports.result.data.totalCount > minRowsBeforeDisplayFilters) || hasFilters,
    [_reports.result.data],
  )

  const filtersCount = useMemo(() => {
    const {offset, limit, ...filters} = _reports.filters
    return Object.keys(cleanObject(filters)).length
  }, [_reports.filters])

  return displayFilters ? (
    <Panel elevation={3} sx={css.filters}>
      <PanelBody sx={css.filtersBody}>
        <Grid container spacing={1}>
          <Grid item sm={6} xs={12}>
            <DebouncedInput
              value={_reports.filters.fullText ?? ''}
              onChange={_ => _reports.updateFilters(prev => ({...prev, fullText: _}))}
            >
              {(value, onChange) => (
                <ScInput
                  label={m.search}
                  placeholder={m.searchByNameOrReference}
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  fullWidth
                  sx={{mr: 1}}
                />
              )}
            </DebouncedInput>
          </Grid>
          <Grid item sm={6} xs={12}>
            <DebouncedInput
              value={
                _reports.filters.hasWebsite === undefined
                  ? ReportType.Both
                  : _reports.filters.hasWebsite
                  ? ReportType.Internet
                  : ReportType.Shop
              }
              onChange={e => {
                const hasWebsite = e === ReportType.Both ? undefined : e === ReportType.Internet
                _reports.updateFilters(prev => ({...prev, hasWebsite}))
              }}
            >
              {(value, onChange) => (
                <ScSelect
                  value={value}
                  variant="outlined"
                  onChange={x => {
                    onChange(x.target.value as ReportType)
                  }}
                  id="select-report-type-pro"
                  sx={{mr: 1}}
                  label={m.reportType}
                  fullWidth
                >
                  {Enum.values(ReportType).map(type => (
                    <MenuItem key={type} value={type}>
                      {m.ReportTypeDesc[type]}
                    </MenuItem>
                  ))}
                </ScSelect>
              )}
            </DebouncedInput>
          </Grid>
          <Grid item sm={4} xs={12}>
            <DebouncedInput
              value={_reports.filters.siretSirenList}
              onChange={_ =>
                _reports.updateFilters(prev => ({
                  ...prev,
                  hasCompany: true,
                  siretSirenList: _,
                }))
              }
            >
              {(value, onChange) => (
                <SelectCompaniesByPro
                  values={value}
                  onChange={onChange}
                  fullWidth
                  sx={{mr: 1}}
                  accessibleCompanies={_accessibleByProData}
                />
              )}
            </DebouncedInput>
          </Grid>
          <Grid item sm={4} xs={12}>
            <DebouncedInput
              value={_reports.filters.departments}
              onChange={departments => _reports.updateFilters(prev => ({...prev, departments}))}
            >
              {(value, onChange) => (
                <SelectDepartments label={m.departments} value={value} onChange={onChange} sx={{mr: 1}} fullWidth />
              )}
            </DebouncedInput>
          </Grid>
          <Grid item sm={4} xs={12}>
            <DebouncedInput
              value={_reports.filters.status?.[0] ? Report.getStatusProByStatus(_reports.filters.status[0]) : ''}
              onChange={e => {
                const status = ScOption.from(e)
                  .filter(_ => _ in ReportStatusPro)
                  .map(_ => Report.getStatusByStatusPro(_ as ReportStatusPro))
                  .toUndefined()
                _reports.updateFilters(prev => ({...prev, status}))
              }}
            >
              {(value, onChange) => (
                <ScSelect
                  value={value}
                  onChange={x => onChange(x.target.value)}
                  id="select-status-pro"
                  label={m.status}
                  fullWidth
                >
                  <MenuItem value="">&nbsp;</MenuItem>
                  {Enum.values(ReportStatusPro).map(statusPro => (
                    <MenuItem
                      sx={{
                        p: 2,
                      }}
                      key={statusPro}
                      value={statusPro}
                    >
                      <ReportStatusProLabel dense fullWidth inSelectOptions status={statusPro} />
                    </MenuItem>
                  ))}
                </ScSelect>
              )}
            </DebouncedInput>
          </Grid>
        </Grid>

        <DebouncedInput<[Date | undefined, Date | undefined]>
          value={[_reports.filters.start, _reports.filters.end]}
          onChange={([start, end]) => _reports.updateFilters(prev => ({...prev, start, end}))}
        >
          {(value, onChange) => <PeriodPicker fullWidth value={value} onChange={onChange} />}
        </DebouncedInput>
        <Box sx={css.actions}>
          <Badge color="error" badgeContent={filtersCount} hidden={filtersCount === 0}>
            <ScButton icon="clear" onClick={_reports.clearFilters} variant="outlined" color="primary">
              {m.removeAllFilters}
            </ScButton>
          </Badge>
          <ExportReportsPopper
            disabled={ScOption.from(_reports?.result.data?.totalCount)
              .map(_ => _ > config.reportsLimitForExport)
              .getOrElse(false)}
            tooltipBtnNew={ScOption.from(_reports?.result.data?.totalCount)
              .map(_ => (_ > config.reportsLimitForExport ? m.cannotExportMoreReports(config.reportsLimitForExport) : ''))
              .getOrElse('')}
            filters={_reports.filters}
          >
            <Btn variant="outlined" color="primary" icon="get_app">
              {m.exportInXLS}
            </Btn>
          </ExportReportsPopper>
        </Box>
      </PanelBody>
    </Panel>
  ) : null
}

function ReportProPageTitle() {
  const {m} = useI18n()
  return (
    <PageTitle
      action={
        <Btn
          variant="outlined"
          color="primary"
          icon="help"
          {...({target: '_blank'} as any)}
          href={config.appBaseUrl + '/comment-ca-marche'}
        >
          {m.help}
          <Icon sx={{ml: 1, color: t => t.palette.text.disabled}}>open_in_new</Icon>
        </Btn>
      }
    >
      {m.reports_pageTitle}
    </PageTitle>
  )
}

function AccountJustActivatedAlert({_reports, hasFilters}: {_reports: ReportsProResult; hasFilters: boolean}) {
  const {m} = useI18n()

  const isFirstVisit = useMemo(
    () => !hasFilters && _reports.result.data?.entities.every(_ => _.report.status === ReportStatus.TraitementEnCours),
    [_reports.result.data],
  )
  return isFirstVisit ? (
    <Alert type="success" deletable persistentDelete sx={{mb: 2}}>
      <span dangerouslySetInnerHTML={{__html: m.yourAccountIsActivated}} />
    </Alert>
  ) : null
}
