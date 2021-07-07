import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {useReportsContext} from '../../core/context/ReportsContext'
import {cleanObject, DetailInputValue, getHostFromUrl, Report, ReportingDateLabel, ReportSearch, ReportSearchResult, Roles} from 'core/api'
import {Panel} from '../../shared/Panel'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {useLoginContext} from '../../App'
import {Datatable} from '../../shared/Datatable/Datatable'
import {fromNullable, some} from 'fp-ts/lib/Option'
import {Badge, Icon, makeStyles, Theme, Tooltip} from '@material-ui/core'
import {addDays, subDays} from 'date-fns'
import {classes, textOverflowMiddleCropping} from '../../core/helper/utils'
import React, {useEffect} from 'react'
import {useQueryString} from '../../core/helper/useQueryString'
import {NavLink} from 'react-router-dom'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'
import {Fender, IconBtn} from 'mui-extension/lib'
import {useToast} from '../../core/toast'
import {Datepicker} from '../../shared/Datepicker/Datepicker'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import {Config} from '../../conf/config'
import {ReportFilters} from './ReportsFilters'
import {siteMap} from '../../core/siteMap'
import {ExportReportsPopper} from '../../shared/ExportPopper/ExportPopperBtn'
import {EntityIcon} from '../../core/EntityIcon'
import {ScButton} from '../../shared/Button/Button'
import {Txt} from 'mui-extension/lib/Txt/Txt'

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
    color: t.palette.text.hint,
  },
  tdPostal: {
    maxWidth: 76,
  },
  tdConsumer: {
    maxWidth: 160,
  },
  tdDesc: {
    fontSize: t.typography.fontSize * 0.875,
    color: t.palette.text.secondary,
    maxWidth: 260,
    lineHeight: 1.4
  },
  tdFiles: {
    minWidth: 44,
    maxWidth: 100,
  },
  tdCategory: {
    maxWidth: 140,
  },
  actions: {
    paddingRight: t.spacing(.25),
    paddingLeft: t.spacing(.25),
  }
}))

export const Reports = ({}) => {
  const {m, formatDate} = useI18n()
  const _reports = useReportsContext()
  const cssUtils = useCssUtils()
  const {connectedUser} = useLoginContext()
  const css = useStyles()
  const {toastError} = useToast()

  const queryString = useQueryString<Readonly<Partial<ReportSearch>>>()

  useEffect(() => {
    _reports.updateFilters({..._reports.initialFilters, ...queryString.get()})
  }, [])

  useEffect(() => {
    fromNullable(_reports.error).map(toastError)
  }, [_reports.list, _reports.error])

  useEffect(() => {
    queryString.update(cleanObject(_reports.filters))
  }, [_reports.filters])

  const getReportingDate = (report: Report) => report.details
    .filter(_ => _.label.indexOf(ReportingDateLabel) !== -1)
    .map(_ => _.value)

  return (
    <Page size="large">
      <PageTitle>{m.reports_pageTitle}</PageTitle>

      <Panel>
        <Datatable<ReportSearchResult>
          header={
            <>
              <SelectDepartments
                className={cssUtils.marginRight}
                fullWidth
                values={_reports.filters.departments}
                onChange={departments => _reports.updateFilters(prev => ({...prev, departments}))}
              />
              <Datepicker
                className={cssUtils.marginRight}
                fullWidth
                label={m.start}
                value={_reports.filters.start}
                onChange={start => {
                  _reports.updateFilters(prev => {
                    if (prev.end && start.getTime() > prev.end.getTime()) {
                      return {...prev, start, end: addDays(start, 1)}
                    }
                    return {...prev, start}
                  })
                }}
              />
              <Datepicker
                fullWidth
                value={_reports.filters.end}
                onChange={end => _reports.updateFilters(prev => {
                  if (prev.start && prev.start.getTime() > end.getTime()) {
                    return {...prev, start: subDays(end, 1), end}
                  }
                  return {...prev, end}
                })}
                label={m.end}
              />
              <ExportReportsPopper
                disabled={fromNullable(_reports?.list?.totalSize).map(_ => _ > Config.reportsLimitForExport).getOrElse(false)}
                tooltipBtnNew={fromNullable(_reports?.list?.totalSize)
                  .map(_ => _ > Config.reportsLimitForExport ? m.cannotExportMoreReports(Config.reportsLimitForExport) : '')
                  .getOrElse('')}
              />
              <Tooltip title={m.removeAllFilters}>
                <IconBtn color="primary" onClick={_reports.clearFilters}>
                  <Icon>clear</Icon>
                </IconBtn>
              </Tooltip>
              <ReportFilters filters={_reports.filters} updateFilters={_ => _reports.updateFilters(prev => ({...prev, ..._}))}>
                <Tooltip title={m.advancedFilters}>
                  <IconBtn color="primary">
                    <Icon>filter_list</Icon>
                  </IconBtn>
                </Tooltip>
              </ReportFilters>
              {/*<Button variant="contained" color="primary" style={{minWidth: 'initial'}} className={cssUtils.nowrap}>Filtres avancés</Button>*/}
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
          rows={[
            {
              id: 'companyPostalCode',
              head: m.postalCodeShort,
              className: css.tdPostal,
              row: _ =>
                <>
                  <span>{_.report.companyPostalCode?.slice(0, 2)}</span>
                  <span className={cssUtils.colorDisabled}>{_.report.companyPostalCode?.substr(2, 5)}</span>
                </>
            },
            {
              id: 'companyName',
              head: m.company,
              className: css.tdName,
              row: _ =>
                <>
                  <span className={css.tdName_label}>{_.report.companyName}</span>
                  <br/>
                  <span className={css.tdName_desc}>{fromNullable(_.report.websiteURL).map(getHostFromUrl).alt(some(_.report.phone)).getOrElse('')}</span>
                </>
            },
            {
              id: 'companySiret',
              head: m.siret,
              hidden: connectedUser.role !== Roles.DGCCRF,
              row: _ => _.report.companySiret
            },
            {
              id: 'category',
              head: m.problem,
              row: _ =>
                <Tooltip title={_.report.subcategories.map((s, i) => <span key={i}>{s}<br/></span>)}>
                  <span>{_.report.category}</span>
                </Tooltip>
            },
            {
              id: 'creationDate',
              head: m.creationDate,
              row: _ => formatDate(_.report.creationDate)
            },
            {
              id: 'reportDate',
              head: 'Date constat',
              hidden: connectedUser.role !== Roles.DGCCRF,
              row: _ => getReportingDate(_.report)
            },
            {
              id: 'details',
              head: m.details,
              className: css.tdDesc,
              row: _ =>
                <Tooltip title={_.report.details?.map((detail, i) =>
                  <div key={i}>
                    <span dangerouslySetInnerHTML={{__html: detail.label}} className={cssUtils.txtBold}/>&nbsp;
                    <span dangerouslySetInnerHTML={{__html: detail.value}} className={cssUtils.colorTxtSecondary}/>
                  </div>
                )}>
                  {(() => {
                    const details = getDetailContent(_.report.details)
                    return (
                      <span>
                        <span dangerouslySetInnerHTML={{__html: details?.firstLine ?? ''}}/><br/>
                        <span dangerouslySetInnerHTML={{__html: details?.secondLine ?? ''}}/>
                      </span>
                    )
                  })()}
                </Tooltip>
            },
            {
              id: 'email',
              head: m.consumer, className: css.tdConsumer, row: _ =>
                <span className={classes(_.report.contactAgreement ? cssUtils.colorSuccess : cssUtils.colorError)}>
                  {textOverflowMiddleCropping(_.report.email, 25)}
                </span>
            },
            {
              id: 'status',
              head: m.status, row: _ =>
                <ReportStatusChip dense status={_.report.status}/>
            },
            {
              id: 'file',
              head: m.files, className: css.tdFiles, row: _ =>
                _.files.length > 0 && (
                  <Badge badgeContent={_.files.length} color="primary" invisible={_.files.length === 1}>
                    <Icon className={cssUtils.colorTxtHint}>insert_drive_file</Icon>
                  </Badge>
                )
            },
            {
              id: 'actions',
              stickyEnd: true,
              className: classes(css.actions),
              row: _ => (
                <NavLink to={siteMap.report(_.report.id)}>
                  <IconBtn className={cssUtils.colorTxtHint}>
                    <Icon>chevron_right</Icon>
                  </IconBtn>
                </NavLink>
              )
            },
          ]}
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
            />}
        />
      </Panel>
    </Page>
  )
}

const getDetailContent = (details: DetailInputValue[]) => {
  const MAX_CHAR_DETAILS = 40

  function getLines(str: String, maxLength: Number) {
    function helper(_strings: string[], currentLine: string, _nbWords: number): number {
      if (!_strings || !_strings.length) {
        return _nbWords
      }
      if (_nbWords >= _strings.length) {
        return _nbWords
      } else {
        const newLine = currentLine + ' ' + _strings[_nbWords]
        if (newLine.length > maxLength) {
          return _nbWords
        } else {
          return helper(_strings, newLine, _nbWords + 1)
        }
      }
    }

    const strings = str.split(' ')
    const nbWords = helper(str.split(' '), '', 0)
    const lines = strings.reduce((prev, curr, index) => index < nbWords
      ? {...prev, line: prev.line + curr + ' '}
      : {...prev, rest: prev.rest + curr + ' '}
      , {line: '', rest: ''})
    return {line: lines.line.trim(), rest: lines.rest.trim()}
  }

  let firstLine = ''
  let secondLine = ''
  let hasNext = false

  if (details && details.length) {
    if (details.length > 2) {
      hasNext = true
    }

    let lines = getLines(details[0].label + ' ' + details[0].value, MAX_CHAR_DETAILS)
    firstLine = lines.line

    if (lines.rest) {
      lines = getLines(lines.rest, MAX_CHAR_DETAILS)
      secondLine = lines.rest ? lines.line.slice(0, -3) + '...' : lines.line

    } else if (details.length > 1) {
      lines = getLines(details[1].label + ' ' + details[1].value, MAX_CHAR_DETAILS)
      secondLine = lines.rest ? lines.line.slice(0, -3) + '...' : lines.line
    }

    return {firstLine, secondLine, hasNext}
  }
}
