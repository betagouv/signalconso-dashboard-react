import { Badge, Box, Icon, MenuItem } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { ScOption } from 'core/helper/ScOption'
import { useBlockedNotificationsQuery } from 'core/queryhooks/reportBlockedNotificationQueryHooks'
import { useEffect, useMemo } from 'react'
import { DebouncedInput } from 'shared/DebouncedInput'
import { Alert, Btn, Fender, makeSx, Txt } from '../../alexlibs/mui-extension'
import { useSetState } from '../../alexlibs/react-hooks-lib'
import { config } from '../../conf/config'
import { EntityIcon } from '../../core/EntityIcon'
import {
  ReportSearchResult,
  ReportStatus,
  ReportStatusPro,
  ReportType,
  ReportUtils,
} from '../../core/client/report/Report'
import { ReportProSearch } from '../../core/client/report/ReportSearch'
import { useLayoutContext } from '../../core/context/layoutContext/layoutContext'
import { cleanObject, openInNew } from '../../core/helper'
import { useI18n } from '../../core/i18n'
import { Id, PaginatedFilters } from '../../core/model'
import { useGetAccessibleByProQuery } from '../../core/queryhooks/companyQueryHooks'
import { useReportSearchQuery } from '../../core/queryhooks/reportQueryHooks'
import { ScButton } from '../../shared/Button'
import { Datatable } from '../../shared/Datatable/Datatable'
import {
  ExportReportsPdfPopper,
  ExportReportsPopper,
} from '../../shared/ExportPopperBtn'
import { Page, PageTitle } from '../../shared/Page'
import { PeriodPicker } from '../../shared/PeriodPicker'
import { ScInput } from '../../shared/ScInput'
import { ScSelect } from '../../shared/Select/Select'
import { SelectCompaniesByPro } from '../../shared/SelectCompaniesByPro/SelectCompaniesByPro'
import { SelectDepartments } from '../../shared/SelectDepartments/SelectDepartments'
import { buildReportsProColumns } from './buildReportsProColumns'
import { ReportSortPro } from '../Reports/ReportSortPro'

const reportsProCss = makeSx({
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

interface ReportsProProps {
  reportType: 'open' | 'closed'
  search: ReportProSearch & Partial<PaginatedFilters>
}

export const ReportsPro = ({ reportType, search }: ReportsProProps) => {
  const reportStatusPro =
    reportType === 'closed'
      ? [ReportStatusPro.Cloture]
      : [ReportStatusPro.ARepondre]

  const obligatoryFilters = {
    status: reportStatusPro.flatMap(ReportUtils.getStatusByStatusPro),
  }

  const filtersAppliedToQuery = {
    offset: 0,
    limit: 25,
    ...search,
    ...obligatoryFilters,
  }

  const handleClearFilters = () => {
    _reports.clearFilters()
    _reports.updateFilters((prevFilters) => ({
      ...prevFilters,
      ...obligatoryFilters,
    }))
  }

  const _reports = useReportSearchQuery(filtersAppliedToQuery)
  const _accessibleByPro = useGetAccessibleByProQuery()
  const _blockedNotifications = useBlockedNotificationsQuery()
  const selectReport = useSetState<Id>()
  const { isMdOrLower } = useLayoutContext()
  const history = useNavigate()
  const { formatDate, m } = useI18n()
  const navigate = useNavigate()
  const columns = buildReportsProColumns({
    _reports,
    selectReport,
    reportType,
    isMdOrLower,
    i18nData: { formatDate, m },
  })

  const hasFilters = useMemo(() => {
    const { limit, offset, ...values } = _reports.filters
    return Object.keys(cleanObject(values)).length > 0 || offset > 0
  }, [_reports.filters])

  const isFirstVisit = useMemo(
    () =>
      !hasFilters &&
      _reports.result.data?.entities.every(
        (_) => _.report.status === ReportStatus.TraitementEnCours,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_reports.result.data],
  )

  const displayFilters = useMemo(
    () =>
      (_reports.result.data &&
        _reports.result.data.totalCount > minRowsBeforeDisplayFilters) ||
      hasFilters,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_reports.result.data],
  )

  const filtersCount = useMemo(() => {
    const { offset, limit, ...filters } = _reports.filters
    return (
      Object.keys(cleanObject(filters)).length -
      Object.keys(obligatoryFilters).length
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_reports.filters])

  useEffect(() => {
    navigate({ to: '.', search: _reports.filters, replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_reports.filters])

  const resetFiltersButtonProps = {
    icon: 'clear',
    onClick: handleClearFilters,
    color: 'primary',
  } as const

  return (
    <Page loading={_accessibleByPro.isLoading}>
      <PageTitle
        action={
          <div className="flex gap-2">
            <Btn
              variant="outlined"
              {...({ target: '_blank' } as any)}
              href={config.appBaseUrl + '/centre-aide'}
            >
              {m.help}
              <Icon sx={{ ml: 1 }}>help</Icon>
            </Btn>
          </div>
        }
      >
        {reportType === 'open'
          ? m.OpenReports_pageTitle
          : m.ClosedReports_pageTitle}
      </PageTitle>

      {isFirstVisit && (
        <Alert
          type="success"
          deletable
          persistentDeleteId="yourAccountIsActivated"
          sx={{ mb: 2 }}
        >
          <span
            dangerouslySetInnerHTML={{ __html: m.yourAccountIsActivated }}
          />
        </Alert>
      )}
      {ScOption.from(_accessibleByPro.data)
        .map((companies) => (
          <>
            {displayFilters && (
              <div className="mb-2">
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <div>
                      <DebouncedInput
                        value={_reports.filters.fullText ?? ''}
                        onChange={(_) =>
                          _reports.updateFilters((prev) => ({
                            ...prev,
                            fullText: _,
                          }))
                        }
                      >
                        {(value, onChange) => (
                          <ScInput
                            label={m.search}
                            placeholder={m.searchByNameOrReference}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            fullWidth
                          />
                        )}
                      </DebouncedInput>
                    </div>
                    <div>
                      <DebouncedInput
                        value={
                          _reports.filters.hasWebsite === undefined
                            ? ReportType.Both
                            : _reports.filters.hasWebsite
                              ? ReportType.Internet
                              : ReportType.Shop
                        }
                        onChange={(e) => {
                          const hasWebsite =
                            e === ReportType.Both
                              ? undefined
                              : e === ReportType.Internet
                          _reports.updateFilters((prev) => ({
                            ...prev,
                            hasWebsite,
                          }))
                        }}
                      >
                        {(value, onChange) => (
                          <ScSelect
                            value={value}
                            variant="outlined"
                            onChange={(x) => {
                              onChange(x.target.value as ReportType)
                            }}
                            id="select-report-type-pro"
                            label={m.reportType}
                            fullWidth
                          >
                            {Object.values(ReportType).map((type) => (
                              <MenuItem key={type} value={type}>
                                {m.ReportTypeDesc[type]}
                              </MenuItem>
                            ))}
                          </ScSelect>
                        )}
                      </DebouncedInput>
                    </div>
                    <div>
                      <DebouncedInput
                        value={_reports.filters.siretSirenList}
                        onChange={(_) =>
                          _reports.updateFilters((prev) => ({
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
                            accessibleCompanies={companies}
                          />
                        )}
                      </DebouncedInput>
                    </div>
                    <div>
                      <DebouncedInput
                        value={_reports.filters.departments}
                        onChange={(departments) =>
                          _reports.updateFilters((prev) => ({
                            ...prev,
                            departments,
                          }))
                        }
                      >
                        {(value, onChange) => (
                          <SelectDepartments
                            label={m.departments}
                            value={value}
                            onChange={onChange}
                            fullWidth
                          />
                        )}
                      </DebouncedInput>
                    </div>
                    <div className="lg:col-span-2">
                      <DebouncedInput<[Date | undefined, Date | undefined]>
                        value={[_reports.filters.start, _reports.filters.end]}
                        onChange={([start, end]) =>
                          _reports.updateFilters((prev) => ({
                            ...prev,
                            start,
                            end,
                          }))
                        }
                      >
                        {(value, onChange) => (
                          <PeriodPicker
                            fullWidth
                            value={value}
                            onChange={onChange}
                          />
                        )}
                      </DebouncedInput>
                    </div>
                  </div>

                  <Box sx={reportsProCss.actions}>
                    {filtersCount > 0 && (
                      <Badge color="error" badgeContent={filtersCount}>
                        <ScButton
                          {...resetFiltersButtonProps}
                          variant="outlined"
                        >
                          {m.removeAllFilters}
                        </ScButton>
                      </Badge>
                    )}
                    <ExportReportsPopper
                      maxElement={config.reportsLimitForExport}
                      disabled={ScOption.from(_reports?.result.data?.totalCount)
                        .map((_) => _ > config.reportsLimitForExport)
                        .getOrElse(false)}
                      tooltipBtnNew={ScOption.from(
                        _reports?.result.data?.totalCount,
                      )
                        .map((_) =>
                          _ > config.reportsLimitForExport
                            ? m.cannotExportMoreReports(
                                config.reportsLimitForExport,
                              )
                            : '',
                        )
                        .getOrElse('')}
                      filters={_reports.filters}
                    >
                      <Btn variant="outlined" color="primary" icon="get_app">
                        Export en Excel
                      </Btn>
                    </ExportReportsPopper>
                    <ExportReportsPdfPopper
                      maxElement={config.reportsPdfLimitForExport}
                      disabled={ScOption.from(_reports?.result.data?.totalCount)
                        .map((_) => _ > config.reportsPdfLimitForExport)
                        .getOrElse(false)}
                      tooltipBtnNew={ScOption.from(
                        _reports?.result.data?.totalCount,
                      )
                        .map((_) =>
                          _ > config.reportsPdfLimitForExport
                            ? m.cannotExportMoreReports(
                                config.reportsPdfLimitForExport,
                              )
                            : '',
                        )
                        .getOrElse('')}
                      filters={_reports.filters}
                    >
                      <Btn
                        disabled={selectReport.size != 0}
                        variant="outlined"
                        color="primary"
                        icon="get_app"
                      >
                        Exporter en PDF
                      </Btn>
                    </ExportReportsPdfPopper>
                  </Box>
                </>
              </div>
            )}
            {_blockedNotifications.data &&
              _blockedNotifications.data.length > 0 && (
                <Alert type="info" className="mb-4">
                  {_blockedNotifications.data.length === 1
                    ? m.activateNotificationsAlertSingle
                    : m.activateNotificationsAlertMultiple(
                        _blockedNotifications.data.length,
                      )}
                </Alert>
              )}

            <>
              <Datatable<ReportSearchResult>
                id={reportType === 'open' ? 'opened-reports' : 'closed-reports'}
                paginate={{
                  minRowsBeforeDisplay: minRowsBeforeDisplayFilters,
                  offset: _reports.filters.offset,
                  limit: _reports.filters.limit,
                  onPaginationChange: (pagination) =>
                    _reports.updateFilters((prev) => ({
                      ...prev,
                      ...pagination,
                    })),
                }}
                onClickRows={(_, e) => {
                  const htmlElement = e.target as HTMLElement
                  //Don't redirect to report when user is checking download report checkbox
                  //Check for specific checkbox id
                  if (htmlElement.id !== `download-checkbox-${_.report.id}`) {
                    if (e.metaKey || e.ctrlKey) {
                      openInNew(`/suivi-des-signalements/report/${_.report.id}`)
                    } else {
                      history({
                        to: '/suivi-des-signalements/report/$reportId',
                        params: { reportId: _.report.id },
                      })
                    }
                  }
                }}
                data={_reports.result.data?.entities}
                loading={
                  _accessibleByPro.isLoading || _reports.result.isFetching
                }
                total={_reports.result.data?.totalCount}
                columns={columns}
                actions={
                  <ReportSortPro
                    loading={false}
                    sortBy={_reports.filters?.sortBy}
                    orderBy={_reports.filters?.orderBy}
                    setSort={(sort, order) => {
                      _reports.updateFilters((prev) => ({
                        ...prev,
                        sortBy: sort as any,
                        orderBy: order,
                      }))
                    }}
                  />
                }
                renderEmptyState={
                  filtersCount === 0 && reportType === 'open' ? (
                    <Fender
                      icon={EntityIcon.thumbUp}
                      title={m.noReportsAtAllTitle}
                      description={
                        <Txt color="hint" size="big" block gutterBottom>
                          {m.noReportsAtAllDesc}
                        </Txt>
                      }
                    />
                  ) : filtersCount === 0 && reportType === 'closed' ? (
                    <Fender
                      icon={EntityIcon.cancel}
                      title={m.noReportsAtCloseTitle}
                      description={
                        <Txt color="hint" size="big" block gutterBottom>
                          {m.noReportsAtCloseDesc}
                        </Txt>
                      }
                    />
                  ) : (
                    <Fender
                      icon={EntityIcon.report}
                      title={m.noReportsTitle}
                      description={
                        <>
                          <Txt color="hint" size="big" block gutterBottom>
                            {m.noReportsDesc}
                          </Txt>
                          <ScButton
                            {...resetFiltersButtonProps}
                            variant="contained"
                          >
                            {m.removeAllFilters}
                          </ScButton>
                        </>
                      }
                    />
                  )
                }
              />
            </>
          </>
        ))
        .toUndefined()}
    </Page>
  )
}
