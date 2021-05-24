import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {useReportsContext} from '../../core/context/ReportsContext'
import {DetailInputValue, getHostFromUrl, Report, ReportFilter, ReportingDateLabel, ReportsSearchResult, Roles} from '@signalconso/signalconso-api-sdk-js/build'
import {Panel} from '../../shared/Panel'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {useLoginContext} from '../../App'
import {Datatable} from './Datatable'
import {some} from 'fp-ts/lib/Option'
import {Icon, InputBase, makeStyles, TextFieldProps, Theme, Tooltip} from '@material-ui/core'
import {ScButton} from '../../shared/Button/Button'
import {DatePicker} from '@material-ui/pickers'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import {addDays, subDays} from 'date-fns'
import {classes, textOverflowMiddleCropping} from '../../core/helper/utils'
import React, {useEffect} from 'react'
import {useQueryString} from '../../core/utils/useQueryString'
import {useHistory} from 'react-router-dom'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'

export const CustomDatePicker = ({value, onChange, label}: {label: string, value?: Date, onChange: (_: Date) => void}) => {
  return (
    <DatePicker
      format="dd/MM/yyyy"
      value={value ?? null}
      onClick={console.log}
      onChange={(start: MaterialUiPickersDate) => onChange(start as Date)}
      TextFieldComponent={(props: TextFieldProps) => <InputBase
        value={props.value}
        onChange={props.onChange}
        onClick={props.onClick}
        placeholder={label}/>
      }
    />
  )
}

const useStyles = makeStyles((t: Theme) => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 52,
    borderBottom: `1px solid ${t.palette.divider}`,
    paddingLeft: t.spacing(2),
    paddingRight: t.spacing(2),
    // '& > *': {
    //   borderRight: `1px solid ${t.palette.divider}`,
    // }
  },
  tdName: {
    lineHeight: 1.1,
    maxWidth: 170,
  },
  tdName_label: {
    fontWeight: 'bold',
    marginBottom: -1,
  },
  tdName_desc: {
    fontSize: t.typography.fontSize * 0.875,
    color: t.palette.text.secondary,
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
    lineHeight: 1.2
  },
  tdFiles: {
    maxWidth: 100,
  },
  tdCategory: {
    maxWidth: 140,
  }
}))

export const Reports = ({}) => {
  const {m, formatDate} = useI18n()
  const _reports = useReportsContext()
  const history = useHistory()
  const cssUtils = useUtilsCss()
  const {connectedUser, apiSdk} = useLoginContext()
  const css = useStyles()

  const test = useQueryString<Readonly<ReportFilter>>()

  useEffect(() => {
    _reports.updateFilters(test.get())
  }, [])

  useEffect(() => {
    test.update(_reports.filters)
  }, [_reports.filters])

  const getReportingDate = (report: Report) => report.details
    .filter(_ => _.label.indexOf(ReportingDateLabel) !== -1)
    .map(_ => _.value)

  return (
    <Page>
      <PageTitle>{m.reports_pageTitle}</PageTitle>

      <Panel>
        <div className={css.toolbar}>
          <SelectDepartments values={_reports.filters.departments} onChange={departments => _reports.updateFilters(prev => ({...prev, departments}))}/>
          <CustomDatePicker
            value={_reports.filters.start}
            onChange={start => {
              _reports.updateFilters(prev => {
                if (prev.end && start.getTime() > prev.end.getTime()) {
                  return {...prev, start, end: addDays(start, 1)}
                }
                return {...prev, start}
              })
            }}
            label={m.start}
          />
          <CustomDatePicker
            value={_reports.filters.end}
            onChange={end => _reports.updateFilters(prev => {
              if (prev.start && prev.start.getTime() > end.getTime()) {
                return {...prev, start: subDays(end, 1), end}
              }
              return {...prev, end}
            })}
            label={m.end}
          />
          <ScButton variant="contained" color="primary">Filtres avancés</ScButton>
        </div>
        <Datatable<ReportsSearchResult>
          loading={_reports.fetching}
          offset={_reports.filters.offset}
          limit={_reports.filters.limit}
          onChangeLimit={limit => _reports.updateFilters(prev => ({...prev, limit}))}
          onChangeOffset={offset => _reports.updateFilters(prev => ({...prev, offset}))}
          getRenderRowId={_ => _.report.id}
          data={_reports.list?.data}
          total={_reports.list?.totalSize}
          rows={[
            {
              head: 'CP', className: css.tdPostal, row: _ =>
                <>
                  <span>{_.report.companyPostalCode?.slice(0, 2)}</span>
                  <span className={cssUtils.colorDisabled}>{_.report.companyPostalCode?.substr(2, 5)}</span>
                </>
            },
            {
              head: 'Entreprise', className: css.tdName, row: _ =>
                <>
                  <span className={css.tdName_label}>{_.report.companyName}</span>
                  <br/>
                  {_.report.website}
                  {_.report.phone}
                  <span className={css.tdName_desc}>{some(_.report.website).map(getHostFromUrl).alt(some(_.report.phone)).getOrElse('')}</span>
                </>
            },
            {
              head: 'SIRET', hidden: connectedUser.role !== Roles.DGCCRF, row: _ => _.report.companySiret
            },
            {
              head: 'Problème', row: _ =>
                <Tooltip title={_.report.subcategories.map((s, i) => <span key={i}>{s}<br/></span>)}>
                  <span>{_.report.category}</span>
                </Tooltip>
            },
            {
              head: 'Création', row: _ => formatDate(_.report.creationDate)
            },
            {
              head: 'Date constat', hidden: connectedUser.role !== Roles.DGCCRF, row: _ => getReportingDate(_.report)
            },
            {
              head: 'Description', className: css.tdDesc, row: _ =>
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
                        <span dangerouslySetInnerHTML={{__html: details?.firstLine ?? ''}}/>&nbsp;
                        <span dangerouslySetInnerHTML={{__html: details?.secondLine ?? ''}}/>
                      </span>
                    )
                  })()}
                </Tooltip>
            },
            {
              head: 'Consommateur', className: css.tdConsumer, row: _ =>
                <span className={classes(_.report.contactAgreement ?? cssUtils.colorDisabled)}>
                  {textOverflowMiddleCropping(_.report.email, 25)}
                </span>
            },
            {
              head: 'Pièces jointes', className: css.tdFiles, row: _ => _.files.map(file =>
                <Tooltip title={file.filename} key={file.id}>
                  <a href={apiSdk.public.document.getLink(file)} target="_blank">
                    <Icon>insert_drive_file</Icon>
                  </a>
                </Tooltip>
              )
            }
          ]}
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
