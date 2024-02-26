import React, {useCallback} from 'react'
import {useI18n} from '../../core/i18n'
import {Box, Divider, Icon, InputBase, Tooltip} from '@mui/material'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {DebouncedInput} from '../../shared/DebouncedInput'

import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {Btn, IconBtn, Txt} from '../../alexlibs/mui-extension'
import {ExportUnknownWebsitesPopper} from '../../shared/ExportPopperBtn'
import {config} from '../../conf/config'
import {PeriodPicker} from '../../shared/PeriodPicker'
import {sxUtils} from '../../core/theme'
import {ScOption} from 'core/helper/ScOption'
import {useListUnregisteredWebsitesSearchQuery} from '../../core/queryhooks/websiteQueryHooks'

export const ReportedUnknownWebsites = () => {
  const {m} = useI18n()
  const unregisteredWebsites = useListUnregisteredWebsitesSearchQuery()

  const onQueryChange = useCallback((query: string) => {
    unregisteredWebsites.updateFilters(prev => ({...prev, q: query}))
    // TRELLO-1391 The object _fetch changes all the time.
    // If we put it in dependencies, it causes problems with the debounce,
    // and the search input "stutters" when typing fast
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Panel>
      <Box sx={{p: 2}}>
        <Txt color="hint" italic>
          {m.reportedUnknownWebsitesText}
        </Txt>
      </Box>
      <Divider />
      <Datatable
        id="reportedunknownwebsites"
        header={
          <>
            <DebouncedInput value={unregisteredWebsites.filters.q ?? ''} onChange={onQueryChange}>
              {(value, onChange) => (
                <InputBase
                  value={value}
                  placeholder={m.searchByHost + '...'}
                  fullWidth
                  style={{minWidth: 120}}
                  sx={{ml: 1}}
                  onChange={e => onChange(e.target.value)}
                />
              )}
            </DebouncedInput>

            <PeriodPicker
              fullWidth
              value={[unregisteredWebsites.filters.start, unregisteredWebsites.filters.end]}
              onChange={([start, end]) => unregisteredWebsites.updateFilters(prev => ({...prev, start, end}))}
            />
          </>
        }
        actions={
          <>
            <Tooltip title={m.removeAllFilters}>
              <IconBtn color="primary" onClick={unregisteredWebsites.clearFilters}>
                <Icon>clear</Icon>
              </IconBtn>
            </Tooltip>

            <ExportUnknownWebsitesPopper
              disabled={ScOption.from(unregisteredWebsites.result.data?.totalCount)
                .map(_ => _ > config.reportsLimitForExport)
                .getOrElse(false)}
              tooltipBtnNew={ScOption.from(unregisteredWebsites.result.data?.totalCount)
                .map(_ => (_ > config.reportsLimitForExport ? m.cannotExportMoreReports(config.reportsLimitForExport) : ''))
                .getOrElse('')}
              filters={unregisteredWebsites.filters}
            >
              <IconBtn color="primary">
                <Icon>file_download</Icon>
              </IconBtn>
            </ExportUnknownWebsitesPopper>
          </>
        }
        loading={unregisteredWebsites.result.isFetching}
        total={unregisteredWebsites.result.data?.totalCount}
        paginate={{
          limit: unregisteredWebsites.filters.limit,
          offset: unregisteredWebsites.filters.offset,
          onPaginationChange: pagination => unregisteredWebsites.updateFilters(prev => ({...prev, ...pagination})),
        }}
        getRenderRowKey={_ => _.host}
        data={unregisteredWebsites.result.data?.entities}
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
            sx: _ => sxUtils.tdActions,
            render: _ => (
              <>
                <NavLink
                  to={siteMap.logged.reports.open({
                    hasWebsite: true,
                    websiteURL: _.host,
                    hasCompany: false,
                    hasForeignCountry: false,
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
