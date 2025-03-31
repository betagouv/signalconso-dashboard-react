import React, { useCallback } from 'react'
import { useI18n } from '../../core/i18n'
import { Icon, Tooltip } from '@mui/material'
import { Datatable } from '../../shared/Datatable/Datatable'
import { DebouncedInput } from '../../shared/DebouncedInput'
import { Btn, IconBtn } from '../../alexlibs/mui-extension'
import { ExportUnknownWebsitesPopper } from '../../shared/ExportPopperBtn'
import { config } from '../../conf/config'
import { PeriodPicker } from '../../shared/PeriodPicker'
import { sxUtils } from '../../core/theme'
import { ScOption } from 'core/helper/ScOption'
import { useListUnregisteredWebsitesSearchQuery } from '../../core/queryhooks/websiteQueryHooks'
import { ScInput } from 'shared/ScInput'
import { Link } from '@tanstack/react-router'

export const ReportedUnknownWebsites = () => {
  const { m } = useI18n()
  const unregisteredWebsites = useListUnregisteredWebsitesSearchQuery()

  const onQueryChange = useCallback((query: string) => {
    unregisteredWebsites.updateFilters((prev) => ({ ...prev, q: query }))
    // TRELLO-1391 The object _fetch changes all the time.
    // If we put it in dependencies, it causes problems with the debounce,
    // and the search input "stutters" when typing fast
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Datatable
        id="reportedunknownwebsites"
        superheader={
          <p className="">
            Liste des sites internet non-identifiés (les plus signalés en
            premier).{' '}
            <span className="block text-gray-500 italic">
              C'est la liste des sites internet pour lesquels au moins un
              utilisateur a fait un signalement sans pouvoir identifier
              l'entreprise (ni le pays), et que les admins n'ont pas identifiés
              non plus.
            </span>
          </p>
        }
        headerMain={
          <div className="flex gap-2 w-full">
            <DebouncedInput
              value={unregisteredWebsites.filters.q ?? ''}
              onChange={onQueryChange}
            >
              {(value, onChange) => (
                <ScInput
                  value={value}
                  placeholder={m.searchByHost + '...'}
                  fullWidth
                  onChange={(e) => onChange(e.target.value)}
                />
              )}
            </DebouncedInput>

            <PeriodPicker
              fullWidth
              value={[
                unregisteredWebsites.filters.start,
                unregisteredWebsites.filters.end,
              ]}
              onChange={([start, end]) =>
                unregisteredWebsites.updateFilters((prev) => ({
                  ...prev,
                  start,
                  end,
                }))
              }
            />
          </div>
        }
        actions={
          <>
            <Tooltip title={m.removeAllFilters}>
              <IconBtn
                color="primary"
                onClick={unregisteredWebsites.clearFilters}
              >
                <Icon>clear</Icon>
              </IconBtn>
            </Tooltip>

            <ExportUnknownWebsitesPopper
              maxElement={config.reportsLimitForExport}
              disabled={ScOption.from(
                unregisteredWebsites.result.data?.totalCount,
              )
                .map((_) => _ > config.reportsLimitForExport)
                .getOrElse(false)}
              tooltipBtnNew={ScOption.from(
                unregisteredWebsites.result.data?.totalCount,
              )
                .map((_) =>
                  _ > config.reportsLimitForExport
                    ? m.cannotExportMoreReports(config.reportsLimitForExport)
                    : '',
                )
                .getOrElse('')}
              filters={unregisteredWebsites.filters}
            >
              <IconBtn color="primary">
                <Icon>file_download</Icon>
              </IconBtn>
            </ExportUnknownWebsitesPopper>
          </>
        }
        headerMarginBottom
        loading={unregisteredWebsites.result.isFetching}
        total={unregisteredWebsites.result.data?.totalCount}
        paginate={{
          limit: unregisteredWebsites.filters.limit,
          offset: unregisteredWebsites.filters.offset,
          onPaginationChange: (pagination) =>
            unregisteredWebsites.updateFilters((prev) => ({
              ...prev,
              ...pagination,
            })),
        }}
        getRenderRowKey={(_) => _.host}
        data={unregisteredWebsites.result.data?.entities}
        columns={[
          {
            id: 'host',
            head: m.website,
            render: (_) => <a href={'https://' + _.host}>{_.host}</a>,
          },
          {
            head: m.reports,
            id: 'reports',
            render: (_) => _.count,
          },
          {
            id: 'actions',
            sx: (_) => sxUtils.tdActions,
            render: (_) => (
              <>
                <Link
                  to="/suivi-des-signalements"
                  search={{
                    hasWebsite: true,
                    websiteURL: _.host,
                    hasCompany: false,
                    hasForeignCountry: false,
                  }}
                >
                  <Btn size="small" color="primary" variant="outlined">
                    {m.see}
                  </Btn>
                </Link>
              </>
            ),
          },
        ]}
      />
    </>
  )
}
