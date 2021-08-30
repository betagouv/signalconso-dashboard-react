import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Icon, InputBase, makeStyles, Theme, Tooltip} from '@material-ui/core'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {ApiHostWithReportCount} from '../../core/api'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {useUnregistredWebsiteWithCompanyContext} from '../../core/context/UnregistredWebsitesContext'
import {useToast} from '../../core/toast'
import {fromNullable} from 'fp-ts/lib/Option'
import {Datepicker} from '../../shared/Datepicker/Datepicker'
import {addDays, subDays} from 'date-fns'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {Btn, IconBtn} from 'mui-extension'
import {ExportReportsPopper, ExportUnknownWebsitesPopper} from '../../shared/ExportPopper/ExportPopperBtn'
import {Config} from '../../conf/config'
import {PeriodPicker} from '../../shared/PeriodPicker/PeriodPicker'

export const ReportedUnknownWebsites = () => {
  const {m} = useI18n()
  const _fetch = useUnregistredWebsiteWithCompanyContext()
  const cssUtils = useCssUtils()
  const {toastError, toastSuccess} = useToast()

  useEffect(() => {
    _fetch.fetch()
  }, [])

  useEffect(() => {
    fromNullable(_fetch.error).map(toastError)
  }, [_fetch.error])

  return (
    <Panel>
      <Datatable<ApiHostWithReportCount>
        header={
          <>
            <DebouncedInput
              debounce={400}
              value={_fetch.filters.q ?? ''}
              onChange={q => _fetch.updateFilters(prev => ({...prev, q: q}))}
            >
              {(value, onChange) => (
                <InputBase
                  value={value}
                  placeholder={m.searchByHost + '...'}
                  fullWidth
                  className={cssUtils.marginLeft}
                  onChange={e => onChange(e.target.value)}
                />
              )}
            </DebouncedInput>

            <PeriodPicker
              fullWidth
              value={[_fetch.filters.start, _fetch.filters.end]}
              onChange={([start, end]) =>
                _fetch.updateFilters(prev => ({...prev, start: start ?? prev.start, end: end ?? prev.end}))
              }
            />
            <Tooltip title={m.removeAllFilters}>
              <IconBtn color="primary" onClick={_fetch.clearFilters}>
                <Icon>clear</Icon>
              </IconBtn>
            </Tooltip>

            <ExportUnknownWebsitesPopper
              disabled={fromNullable(_fetch?.list?.totalSize)
                .map(_ => _ > Config.reportsLimitForExport)
                .getOrElse(false)}
              tooltipBtnNew={fromNullable(_fetch?.list?.totalSize)
                .map(_ => (_ > Config.reportsLimitForExport ? m.cannotExportMoreReports(Config.reportsLimitForExport) : ''))
                .getOrElse('')}
            >
              <IconBtn color="primary">
                <Icon>file_download</Icon>
              </IconBtn>
            </ExportUnknownWebsitesPopper>
          </>
        }
        loading={_fetch.fetching}
        total={_fetch.list?.totalSize}
        paginate={{
          limit: _fetch.filters.limit,
          offset: _fetch.filters.offset,
          onPaginationChange: pagination => _fetch.updateFilters(prev => ({...prev, ...pagination})),
        }}
        getRenderRowKey={_ => _.host}
        data={_fetch.list?.data}
        rows={[
          {
            id: 'host',
            head: m.website,
            row: _ => <a href={'https://' + _.host}>{_.host}</a>,
          },
          {
            head: m.reports,
            id: 'reports',
            row: _ => _.count,
          },
          {
            id: 'actions',
            className: cssUtils.txtRight,
            row: _ => (
              <>
                <NavLink
                  to={siteMap.reports({
                    websiteURL: _.host,
                  })}
                >
                  <Btn size="small" color="primary" variant="outlined">
                    {m.see}
                  </Btn>
                </NavLink>
              </>
            ),
          },
        ]}
      />
    </Panel>
  )
}
