import { Icon, Tooltip } from '@mui/material'
import { useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { Btn, IconBtn, Txt } from '../../alexlibs/mui-extension'
import { useI18n } from '../../core/i18n'
import { useReportedPhonesSearchQuery } from '../../core/queryhooks/phoneQueryHooks'
import { siteMap } from '../../core/siteMap'
import { sxUtils } from '../../core/theme'
import { Datatable } from '../../shared/Datatable/Datatable'
import { DebouncedInput } from '../../shared/DebouncedInput'
import { ExportPhonesPopper } from '../../shared/ExportPopperBtn'
import { Page, PageTitle } from '../../shared/Page'
import { PeriodPicker } from '../../shared/PeriodPicker'
import { ScInput } from '../../shared/ScInput'

export const ReportedPhones = () => {
  const _reportedPhone = useReportedPhonesSearchQuery()
  const { m } = useI18n()

  const onPhoneChange = useCallback((phone: string) => {
    _reportedPhone.updateFilters((prev) => ({ ...prev, phone }))
    // TRELLO-1391 The object _reportedPhone changes all the time.
    // If we put it in dependencies, it causes problems with the debounce,
    // and the search input "stutters" when typing fast
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Page>
      <PageTitle>{m.reportedPhoneTitle}</PageTitle>
      <>
        <Datatable
          id="reportedphones"
          showColumnsToggle
          superheader={
            <p>Cette page liste les numéros de téléphone les plus signalés.</p>
          }
          headerMain={
            <div className="flex w-full gap-2">
              <DebouncedInput
                value={_reportedPhone.filters.phone ?? ''}
                onChange={onPhoneChange}
              >
                {(value, onChange) => (
                  <ScInput
                    style={{ minWidth: 120 }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    fullWidth
                    label={m.phone}
                  />
                )}
              </DebouncedInput>
              <DebouncedInput<[Date | undefined, Date | undefined]>
                value={[
                  _reportedPhone.filters.start,
                  _reportedPhone.filters.end,
                ]}
                onChange={([start, end]) =>
                  _reportedPhone.updateFilters((prev) => ({
                    ...prev,
                    start,
                    end,
                  }))
                }
              >
                {(value, onChange) => (
                  <PeriodPicker value={value} onChange={onChange} fullWidth />
                )}
              </DebouncedInput>
            </div>
          }
          actions={
            <>
              <Tooltip title={m.removeAllFilters}>
                <IconBtn color="primary" onClick={_reportedPhone.clearFilters}>
                  <Icon>clear</Icon>
                </IconBtn>
              </Tooltip>
              <ExportPhonesPopper filters={_reportedPhone.filters}>
                <IconBtn color="primary">
                  <Icon>file_download</Icon>
                </IconBtn>
              </ExportPhonesPopper>
            </>
          }
          headerMarginBottom
          paginate={{
            onPaginationChange: (pagination) =>
              _reportedPhone.updateFilters((prev) => ({
                ...prev,
                ...pagination,
              })),
            offset: _reportedPhone.filters.offset,
            limit: _reportedPhone.filters.limit,
          }}
          total={_reportedPhone.result.data?.totalCount}
          loading={_reportedPhone.result.isFetching}
          data={_reportedPhone.result.data?.entities}
          columns={[
            {
              id: 'phone',
              head: m.phone,
              render: (_) => _.phone,
            },
            {
              id: 'siret',
              head: m.siret,
              sx: (_) => ({
                maxWidth: 200,
              }),
              render: (_) => (
                <>
                  <Txt bold>{_.siret}</Txt>
                  <br />
                  <Txt color="hint">{_.companyName}</Txt>
                </>
              ),
            },
            {
              id: 'count',
              head: m.reportsCount,
              render: (_) => _.count,
            },
            {
              id: 'actions',
              sx: (_) => sxUtils.tdActions,
              render: (_) => (
                <>
                  <NavLink
                    to={siteMap.logged.reports({
                      hasPhone: true,
                      phone: _.phone,
                      ...(_.siret
                        ? { hasCompany: true, siretSirenList: [_.siret] }
                        : {}),
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
      </>
    </Page>
  )
}
