import React, {useEffect} from 'react'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Icon, InputBase, Tooltip} from '@mui/material'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {ApiHostWithReportCount} from '@signal-conso/signalconso-api-sdk-js'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {useUnregistredWebsiteWithCompanyContext} from '../../core/context/UnregistredWebsitesContext'
import {useToast} from '../../core/toast'
import {fromNullable} from 'fp-ts/lib/Option'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {Btn, IconBtn} from 'mui-extension'
import {ExportUnknownWebsitesPopper} from '../../shared/ExportPopper/ExportPopperBtn'
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
      <Datatable
        id="reportedunknownwebsites"
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
                  style={{minWidth: 120}}
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
          </>
        }
        actions={
          <>
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
        columns={[
          {
            id: 'host',
            head: m.website,
            render: _ => <a href={'https://' + _.host}>{_.host}</a>,
          },
          {
            head: m.reports,
            id: 'reports',
            render: _ => _.count,
          },
          {
            id: 'actions',
            className: cssUtils.txtRight,
            render: _ => (
              <>
                <NavLink
                  to={siteMap.logged.reports({
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
