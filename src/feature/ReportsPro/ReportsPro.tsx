import React, {useEffect, useMemo} from 'react'
import {Page} from '../../shared/Layout'
import {Panel} from '../../shared/Panel'
import {useReportsContext} from '../../core/context/ReportsContext'
import {Datatable} from '../../shared/Datatable/Datatable'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Badge, Icon, makeStyles, MenuItem, Theme} from '@material-ui/core'
import {ReportStatusChip} from '../../shared/ReportStatus/ReportStatus'
import {useLayoutContext} from '../../core/Layout/LayoutContext'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {cleanObject, ReportSearch, ReportSearchResult} from '../../core/api'
import {utilsStyles} from '../../core/theme'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'
import {ScSelect} from '../../shared/Select/Select'
import {useConstantContext} from '../../core/context/ConstantContext'
import {useHistory} from 'react-router'
import {siteMap} from '../../core/siteMap'
import {classes} from '../../core/helper/utils'
import {Datepicker} from '../../shared/Datepicker/Datepicker'
import {addDays, subDays} from 'date-fns'
import {Fender} from 'mui-extension/lib'
import {EntityIcon} from '../../core/EntityIcon'
import {ScButton} from '../../shared/Button/Button'
import {useQueryString} from '../../core/helper/useQueryString'
import {fromNullable} from 'fp-ts/lib/Option'
import {useToast} from '../../core/toast'

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
  }
}))

const minRowsBeforeDisplayFilters = 2

export const ReportsPro = () => {
  const _reports = useReportsContext()
  const _reportStatus = useConstantContext().reportStatus

  const {formatDate, m} = useI18n()

  const css = useStyles()
  const cssUtils = useCssUtils()

  const {isMobileWidth} = useLayoutContext()
  const history = useHistory()
  const {toastError} = useToast()

  const hasFilters = () => {
    const {limit, offset, ...values} = _reports.filters
    return Object.keys(cleanObject(values)).length > 0 || offset > 0
  }

  const displayFilters = useMemo(
    () => (_reports.list && _reports.list.totalSize > minRowsBeforeDisplayFilters) || hasFilters(),
    [_reports.list]
  )

  const queryString = useQueryString<Readonly<Partial<ReportSearch>>>()

  useEffect(() => {
    console.log(queryString.get())
    _reports.updateFilters({..._reports.initialFilters, ...queryString.get()})
    _reportStatus.fetch()
  }, [])

  useEffect(() => {
    queryString.update(cleanObject(_reports.filters))
  }, [_reports.filters])

  useEffect(() => {
    fromNullable(_reports.error).map(toastError)
  }, [_reports.list, _reports.error])

  return (
    <Page size="small">
      <Panel>
        <Datatable<ReportSearchResult>
          header={displayFilters && (
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
                className={cssUtils.marginRight}
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
              <ScSelect
                label={m.status}
                fullWidth
                onChange={event => {
                  console.log(event)
                  _reports.updateFilters(prev => ({...prev, status: event.target.value as string}))
                }}
                value={_reports.filters.status ?? ''}
              >
                <MenuItem value="">&nbsp;</MenuItem>
                {(_reportStatus.entity ?? []).map(status =>
                  <MenuItem key={status} value={status}>
                    <ReportStatusChip dense fullWidth inSelectOptions status={status}/>
                  </MenuItem>
                )}
              </ScSelect>
            </>
          )}
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
                  </div>
                },
              ]
              :
              [
                {
                  id: 'companyPostalCode',
                  head: m.postalCodeShort,
                  row: _ => _.report.companyAddress.postalCode,
                },
                {
                  id: 'siret',
                  head: m.siret,
                  className: cssUtils.txtBold,
                  row: _ => _.report.companySiret
                },
                {
                  id: 'createDate',
                  head: m.receivedAt,
                  row: _ => formatDate(_.report.creationDate),
                },
                {
                  id: 'status',
                  head: m.status,
                  row: _ => <ReportStatusChip dense status={_.report.status}/>
                },
                {
                  id: 'consumer',
                  head: m.status,
                  row: _ => _.report.contactAgreement ? _.report.firstName + ' ' + _.report.lastName : m.anonymousReport,
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
            />
          }
        />
      </Panel>
    </Page>
  )
}
