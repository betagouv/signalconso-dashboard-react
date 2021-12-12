import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {useReportsContext} from '../../core/context/ReportsContext'
import {cleanObject, getHostFromUrl, Report, ReportingDateLabel, ReportSearch, ReportTag} from '@signal-conso/signalconso-api-sdk-js'
import {Panel} from '../../shared/Panel'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Datatable} from '../../shared/Datatable/Datatable'
import {fromNullable, some} from 'fp-ts/lib/Option'
import {alpha, Badge, Button, Chip, Grid, Icon, Theme, Tooltip} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {classes, textOverflowMiddleCropping} from '../../core/helper/utils'
import React, {useEffect, useMemo} from 'react'
import {mapArrayFromQuerystring, mapBooleanFromQueryString, mapDateFromQueryString, mapDatesToQueryString, useQueryString} from '../../core/helper/useQueryString'
import {NavLink} from 'react-router-dom'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'
import {Fender, IconBtn} from 'mui-extension/lib'
import {useToast} from '../../core/toast'
import {ReportStatusLabel} from '../../shared/ReportStatus/ReportStatus'
import {config} from '../../conf/config'
import {ReportFilters} from './ReportsFilters'
import {siteMap} from '../../core/siteMap'
import {ExportReportsPopper} from '../../shared/ExportPopper/ExportPopperBtn'
import {EntityIcon} from '../../core/EntityIcon'
import {ScButton} from '../../shared/Button/Button'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {PeriodPicker} from '../../shared/PeriodPicker/PeriodPicker'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {ReportDetailValues} from '../../shared/ReportDetailValues/ReportDetailValues'
import {styleUtils} from '../../core/theme'
import compose from '../../core/helper/compose'

const useStyles = makeStyles((t: Theme) => ({
  toolbar: {},
  tdName: {
    lineHeight: 1.4,
    maxWidth: 170,
  },
  tdName_label: {
    fontWeight: 'bold',
    marginBottom: -1,
  },
  tdName_desc: {
    fontSize: t.typography.fontSize * 0.875,
    color: t.palette.text.disabled,
  },
  tdPostal: {
    maxWidth: 76,
  },
  tdConsumer: {
    maxWidth: 160,
  },
  tdDesc: {
    fontSize: styleUtils(t).fontSize.small,
    color: t.palette.text.secondary,
    maxWidth: 200,
    minWidth: 200,
    lineHeight: 1.4,
    whiteSpace: 'initial',
  },
  tdFiles: {
    minWidth: 44,
    maxWidth: 100,
  },
  tdCategory: {
    maxWidth: 140,
  },
  actions: {
    paddingRight: t.spacing(0.25),
    paddingLeft: t.spacing(0.25),
  },
  tdProblem: {
    maxWidth: 200,
  },
  tooltipUl: {
    margin: 0,
    padding: 16,
  },
  clearIcons: {
    minWidth: 'auto',
  },
  clearIconWithFilters: {
    border: '1px solid ' + t.palette.divider,
    background: alpha(t.palette.primary.main, 0.12),
  },
}))

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
  offset: number
  limit: number
}

export const Reports = ({}) => {
  const {m, formatDate} = useI18n()
  const _reports = useReportsContext()
  const cssUtils = useCssUtils()
  const css = useStyles()
  const {toastError} = useToast()
  const queryString = useQueryString<Partial<ReportSearch>, Partial<ReportSearchQs>>({
    toQueryString: mapDatesToQueryString,
    fromQueryString: compose(
      mapDateFromQueryString,
      mapArrayFromQuerystring(['status', 'departments', 'tags', 'companyCountries', 'siretSirenList', 'activityCodes']),
      mapBooleanFromQueryString(['hasCompany', 'hasForeignCountry', 'hasPhone', 'hasWebsite']),
    ),
  })

  useEffect(() => {
    _reports.updateFilters({..._reports.initialFilters, ...queryString.get()})
  }, [])

  useEffect(() => {
    queryString.update(cleanObject(_reports.filters))
  }, [_reports.filters])

  useEffect(() => {
    fromNullable(_reports.error).map(toastError)
  }, [_reports.list, _reports.error])

  const getReportingDate = (report: Report) =>
    report.details.filter(_ => _.label.indexOf(ReportingDateLabel) !== -1).map(_ => _.value)

  const filtersCount = useMemo(() => {
    const {offset, limit, ...filters} = _reports.filters
    return Object.keys(cleanObject(filters)).length
  }, [_reports.filters])

  return (
    <Page size="large">
      <PageTitle>{m.reports_pageTitle}</PageTitle>
      <Panel>
        <Datatable
          id="reports"
          header={
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <DebouncedInput
                  value={_reports.filters.departments}
                  onChange={departments => _reports.updateFilters(prev => ({...prev, departments}))}
                >
                  {(value, onChange) => (
                    <SelectDepartments label={m.departments} value={value} onChange={onChange} className={cssUtils.marginRight} fullWidth/>
                  )}
                </DebouncedInput>
              </Grid>
              <Grid item xs={12} md={6}>
                <DebouncedInput<[Date | undefined, Date | undefined]>
                  value={[_reports.filters.start, _reports.filters.end]}
                  onChange={([start, end]) => {
                    _reports.updateFilters(prev => ({...prev, start: start ?? prev.start, end: end ?? prev.end}))
                  }}
                >
                  {(value, onChange) => (
                    <PeriodPicker value={value} onChange={onChange} className={cssUtils.marginRight} fullWidth/>
                  )}
                </DebouncedInput>
              </Grid>
            </Grid>
          }
          actions={
            <>
              <Tooltip title={m.removeAllFilters}>
                <Badge color="error" badgeContent={filtersCount} hidden={filtersCount === 0} overlap="circular">
                  <Button
                    color="primary"
                    onClick={_reports.clearFilters}
                    className={classes(css.clearIcons, filtersCount && css.clearIconWithFilters)}
                  >
                    <Icon>clear</Icon>
                  </Button>
                </Badge>
              </Tooltip>
              <ExportReportsPopper
                disabled={fromNullable(_reports?.list?.totalSize)
                  .map(_ => _ > config.reportsLimitForExport)
                  .getOrElse(false)}
                tooltipBtnNew={fromNullable(_reports?.list?.totalSize)
                  .map(_ => (_ > config.reportsLimitForExport ? m.cannotExportMoreReports(config.reportsLimitForExport) : ''))
                  .getOrElse('')}
              >
                <IconBtn color="primary">
                  <Icon>file_download</Icon>
                </IconBtn>
              </ExportReportsPopper>
              <ReportFilters filters={_reports.filters} updateFilters={_ => {
                _reports.updateFilters(prev => ({...prev, ..._}))
              }}>
                <Tooltip title={m.advancedFilters}>
                  <IconBtn color="primary">
                    <Icon>filter_list</Icon>
                  </IconBtn>
                </Tooltip>
              </ReportFilters>
            </>
          }
          loading={_reports.fetching}
          paginate={{
            offset: _reports.filters.offset,
            limit: _reports.filters.limit,
            onPaginationChange: pagination => _reports.updateFilters(prev => ({...prev, ...pagination})),
          }}
          getRenderRowKey={_ => _.report.id}
          data={_reports.list?.data}
          total={_reports.list?.totalSize}
          showColumnsToggle={true}
          columns={[
            {
              id: 'companyPostalCode',
              head: m.postalCodeShort,
              className: css.tdPostal,
              render: _ => (
                <>
                  <span>{_.report.companyAddress.postalCode?.slice(0, 2)}</span>
                  <span className={cssUtils.colorDisabled}>{_.report.companyAddress.postalCode?.substr(2, 5)}</span>
                </>
              ),
            },
            {
              id: 'companyName',
              head: m.company,
              className: css.tdName,
              render: _ => (
                <>
                  <span className={css.tdName_label}>{_.report.companyName}</span>
                  <br />
                  <span className={css.tdName_desc}>
                    {fromNullable(_.report.websiteURL).map(getHostFromUrl).alt(some(_.report.phone)).getOrElse('')}
                  </span>
                </>
              ),
            },
            {
              id: 'companySiret',
              head: m.siret,
              render: _ => _.report.companySiret,
            },
            {
              id: 'companyCountry',
              head: m.country,
              render: _ => _.report.companyAddress.country,
            },
            {
              id: 'category',
              head: m.problem,
              className: css.tdProblem,
              render: _ => (
                <Tooltip
                  title={
                    <>
                      <b>{_.report.category}</b>
                      <ul className={css.tooltipUl}>
                        {_.report.subcategories.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </>
                  }
                >
                  <span>{_.report.category}</span>
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
              className: css.tdDesc,
              render: _ => <ReportDetailValues input={_.report.details} lines={2} />,
            },
            {
              id: 'email',
              head: m.consumer,
              className: css.tdConsumer,
              render: _ => (
                <span className={classes(_.report.contactAgreement ? cssUtils.colorSuccess : cssUtils.colorError)}>
                  {textOverflowMiddleCropping(_.report.email ?? '', 25)}
                </span>
              ),
            },
            {
              id: 'status',
              head: m.status,
              render: _ => <ReportStatusLabel dense status={_.report.status}/>,
            },
            {
              id: 'tags',
              head: m.tags,
              render: _ => _.report.tags.map(tag =>
                <Chip
                  key={tag}
                  size="small"
                  variant="outlined"
                  label={tag}
                  className={classes(cssUtils.colorTxtSecondary, cssUtils.txtBold)}
                  style={{marginRight: 2}}
                />,
              ),
            },
            {
              id: 'file',
              head: m.files,
              className: css.tdFiles,
              render: _ =>
                _.files.length > 0 && (
                  <Badge badgeContent={_.files.length} color="primary" invisible={_.files.length === 1}>
                    <Icon className={cssUtils.colorTxtHint}>insert_drive_file</Icon>
                  </Badge>
                ),
            },
            {
              id: 'actions',
              stickyEnd: true,
              className: classes(css.actions),
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
