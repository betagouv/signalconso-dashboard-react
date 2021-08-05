import React, {useEffect, useMemo} from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {Panel, PanelBody} from '../../shared/Panel'
import {useReportsContext} from '../../core/context/ReportsContext'
import {Datatable} from '../../shared/Datatable/Datatable'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Badge, Grid, Icon, makeStyles, MenuItem, Theme} from '@material-ui/core'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import {useLayoutContext} from '../../core/Layout/LayoutContext'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {cleanObject, ReportSearch, ReportSearchResult, ReportStatus} from '../../core/api'
import {utilsStyles} from '../../core/theme'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'
import {ScSelect} from '../../shared/Select/Select'
import {useConstantContext} from '../../core/context/ConstantContext'
import {useHistory} from 'react-router'
import {siteMap} from '../../core/siteMap'
import {classes} from '../../core/helper/utils'
import {Btn, Fender} from 'mui-extension/lib'
import {EntityIcon} from '../../core/EntityIcon'
import {ScButton} from '../../shared/Button/Button'
import {mapArrayFromQuerystring, mapDateFromQueryString, mapDatesToQueryString, useQueryString} from '../../core/helper/useQueryString'
import {fromNullable} from 'fp-ts/lib/Option'
import {useToast} from '../../core/toast'
import {Config} from '../../conf/config'
import {ExportReportsPopper} from '../../shared/ExportPopper/ExportPopperBtn'
import {PeriodPicker} from '../../shared/PeriodPicker/PeriodPicker'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {SelectCompaniesByPro} from '../../shared/SelectCompaniesByPro/SelectCompaniesByPro'
import compose from '../../core/helper/compose'

const useStyles = makeStyles((t: Theme) => ({
  tdFiles: {
    minWidth: 44,
    maxWidth: 100,
  },
  card: {
    fontSize: utilsStyles(t).fontSize.normal,
    display: 'flex',
    alignItems: 'center',
    padding: t.spacing(1, 2),
  },
  card_content: {
    flex: 1,
  },
  iconDash: {
    margin: t.spacing(0, 1),
  },
  card_head: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: t.spacing(1 / 2),
  },
  filters: {
    marginBottom: t.spacing(3),
  },
  filtersBody: {
    paddingBottom: `${t.spacing(1)}px !important`,
  },
  actions: {
    flexWrap: 'wrap',
    whiteSpace: 'nowrap',
    marginTop: t.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    '& > *': {
      marginBottom: t.spacing(1),
      marginLeft: t.spacing(1),
    },
  },
}))

const minRowsBeforeDisplayFilters = 10

interface ReportFiltersQs {
  readonly departments?: string[] | string
  readonly siretSirenList?: string[] | string
  start?: string
  end?: string
  status?: string
}

export const ReportsPro = () => {
  const _reports = useReportsContext()
  const _reportStatus = useConstantContext().reportStatus
  const _companies = useCompaniesContext()

  const {isMobileWidth} = useLayoutContext()
  const history = useHistory()
  const {toastError} = useToast()
  const {formatDate, m} = useI18n()
  const css = useStyles()
  const cssUtils = useCssUtils()

  const hasFilters = useMemo(() => {
    const {limit, offset, ...values} = _reports.filters
    return Object.keys(cleanObject(values)).length > 0 || offset > 0
  }, [_reports.filters])

  const displayFilters = useMemo(
    () => (_reports.list && _reports.list.totalSize > minRowsBeforeDisplayFilters) || hasFilters,
    [_reports.list],
  )

  const queryString = useQueryString<Partial<ReportSearch>, Partial<ReportFiltersQs>>({
    toQueryString: mapDatesToQueryString,
    fromQueryString: compose(
      mapDateFromQueryString,
      _ => mapArrayFromQuerystring(_, ['siretSirenList', 'departments']),
    ),
  })

  useEffect(() => {
    _companies.accessesByPro.fetch()
    _companies.viewableByPro.fetch()
    _reportStatus.fetch()
    _reports.updateFilters({..._reports.initialFilters, ...queryString.get()})
  }, [])

  useEffect(() => {
    fromNullable(_companies.accessesByPro.error).map(toastError)
    fromNullable(_companies.viewableByPro.error).map(toastError)
    fromNullable(_reports.error).map(toastError)
  }, [
    _reports.error,
    _companies.accessesByPro.error,
    _companies.viewableByPro.error,
  ])

  useEffect(() => {
    queryString.update(cleanObject(_reports.filters))
  }, [_reports.filters])

  return (
    <Page size="small" loading={_companies.accessesByPro.loading || _companies.viewableByPro.loading}>
      <PageTitle action={
        <Btn variant="outlined" color="primary" icon="help" {...{target: '_blank'} as any} href={Config.appBaseUrl + '/comment-ça-marche/professionnel'}>
          {m.help}
          <Icon className={classes(cssUtils.marginLeft, cssUtils.colorTxtHint)}>open_in_new</Icon>
        </Btn>
      }>{m.reports_pageTitle}</PageTitle>

      {_companies.accessesByPro.entity && _companies.viewableByPro.entity && (
        <>
          {displayFilters && (
            <Panel elevation={3} className={css.filters}>
              <PanelBody className={css.filtersBody}>
                <Grid container spacing={1}>
                  <Grid item sm={4} xs={12}>
                    <SelectCompaniesByPro
                      values={_reports.filters.siretSirenList}
                      fullWidth
                      onChange={_ => _reports.updateFilters(prev => ({...prev, siretSirenList: _}))}
                      className={cssUtils.marginRight}
                      accessibleCompanies={_companies.accessesByPro.entity}
                      visibleCompanies={_companies.viewableByPro.entity}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <SelectDepartments
                      className={cssUtils.marginRight}
                      fullWidth
                      values={_reports.filters.departments}
                      onChange={departments => _reports.updateFilters(prev => ({...prev, departments}))}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <ScSelect
                      label={m.status}
                      fullWidth
                      onChange={event => {
                        _reports.updateFilters(prev => ({...prev, status: event.target.value as string}))
                      }}
                      value={_reports.filters.status ?? ''}
                    >
                      <MenuItem value="">&nbsp;</MenuItem>
                      {(_reportStatus.entity ?? []).map(status =>
                        <MenuItem key={status} value={status}>
                          <ReportStatusChip dense fullWidth inSelectOptions status={status}/>
                        </MenuItem>,
                      )}
                    </ScSelect>
                  </Grid>
                </Grid>
                <PeriodPicker
                  fullWidth
                  value={[_reports.filters.start, _reports.filters.end]}
                  onChange={([start, end]) => _reports.updateFilters(prev => ({...prev, start: start ?? prev.start, end: end ?? prev.end}))}
                />
                <div className={css.actions}>
                  <ScButton size="small" icon="clear" onClick={_reports.clearFilters} variant="outlined" color="primary">
                    {m.removeAllFilters}
                  </ScButton>
                  <ExportReportsPopper
                    disabled={fromNullable(_reports?.list?.totalSize).map(_ => _ > Config.reportsLimitForExport).getOrElse(false)}
                    tooltipBtnNew={fromNullable(_reports?.list?.totalSize)
                      .map(_ => _ > Config.reportsLimitForExport ? m.cannotExportMoreReports(Config.reportsLimitForExport) : '')
                      .getOrElse('')}
                  >
                    <Btn size="small" variant="outlined" color="primary" icon="get_app">
                      {m.exportInXLS}
                    </Btn>
                  </ExportReportsPopper>
                </div>
              </PanelBody>
            </Panel>
          )}

          <Panel>
            <Datatable<ReportSearchResult>
              paginate={{
                minRowsBeforeDisplay: minRowsBeforeDisplayFilters,
                offset: _reports.filters.offset,
                limit: _reports.filters.limit,
                onPaginationChange: pagination => _reports.updateFilters(prev => ({...prev, ...pagination})),
              }}
              data={_reports.list?.data}
              loading={_reports.fetching}
              total={_reports.list?.totalSize}
              onClickRows={_ => history.push(siteMap.report(_.report.id))}
              rows={
                isMobileWidth ? [
                    {
                      id: 'all',
                      head: '',
                      row: _ => <div className={css.card}>
                        <div className={css.card_content}>
                          <div className={css.card_head}>
                            <Txt bold size="big">{_.report.companySiret}</Txt>
                            <Icon className={classes(css.iconDash, cssUtils.inlineIcon)}>remove</Icon>
                            <Txt color="disabled">
                              <Icon className={cssUtils.inlineIcon}>location_on</Icon>
                              {_.report.companyAddress.postalCode}
                            </Txt>
                          </div>
                          <Txt block color="hint">{m.thisDate(formatDate(_.report.creationDate))}</Txt>
                          <Txt block color="hint">{_.report.contactAgreement ? m.byHim(_.report.firstName + ' ' + _.report.lastName) : m.anonymousReport}</Txt>
                        </div>
                        <ReportStatusChip dense status={_.report.status}/>
                      </div>,
                    },
                  ]
                  :
                  [
                    {
                      id: 'companyPostalCode',
                      head: m.postalCodeShort,
                      className: _ => _.report.status === ReportStatus.UnreadForPro ? cssUtils.txtBold : undefined,
                      row: _ => _.report.companyAddress.postalCode,
                    },
                    {
                      id: 'siret',
                      head: m.siret,
                      className: _ => _.report.status === ReportStatus.UnreadForPro ? cssUtils.txtBold : undefined,
                      row: _ => _.report.companySiret,
                    },
                    {
                      id: 'createDate',
                      head: m.receivedAt,
                      className: _ => _.report.status === ReportStatus.UnreadForPro ? cssUtils.txtBold : undefined,
                      row: _ => formatDate(_.report.creationDate),
                    },
                    {
                      id: 'status',
                      head: m.status,
                      row: _ => <ReportStatusChip dense status={_.report.status}/>,
                    },
                    {
                      id: 'consumer',
                      head: m.consumer,
                      className: _ => _.report.status === ReportStatus.UnreadForPro ? cssUtils.txtBold : undefined,
                      row: _ => _.report.contactAgreement ? _.report.firstName + ' ' + _.report.lastName : m.anonymousReport,
                    },
                    {
                      id: 'file',
                      head: m.files, className: css.tdFiles, row: _ =>
                        _.files.length > 0 && (
                          <Badge badgeContent={_.files.length} color="primary" invisible={_.files.length === 1}>
                            <Icon className={cssUtils.colorTxtHint}>insert_drive_file</Icon>
                          </Badge>
                        ),
                    },
                  ]
              }
              renderEmptyState={
                <Fender
                  icon={EntityIcon.report}
                  title={m.noReportsTitle}
                  description={
                    <>
                      <Txt color="hint" size="big" block gutterBottom>{m.noReportsDesc}</Txt>
                      <ScButton icon="clear" onClick={_reports.clearFilters} variant="contained" color="primary">
                        {m.removeAllFilters}
                      </ScButton>
                    </>
                  }
                />
              }
            />
          </Panel>
        </>
      )}
    </Page>
  )
}
