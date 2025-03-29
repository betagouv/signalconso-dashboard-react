import { Icon, Tooltip } from '@mui/material'
import { QuickSmallReportSearchLink } from 'feature/Report/quickSmallLinks'
import { useCallback } from 'react'
import { DatatableEmptyCell } from 'shared/Datatable/DatatableEmptyCell'
import { IconBtn } from '../../alexlibs/mui-extension'
import { useI18n } from '../../core/i18n'
import { useReportedPhonesSearchQuery } from '../../core/queryhooks/phoneQueryHooks'
import { Datatable } from '../../shared/Datatable/Datatable'
import { DebouncedInput } from '../../shared/DebouncedInput'
import { ExportPhonesPopper } from '../../shared/ExportPopperBtn'
import { Page, PageTitle } from '../../shared/Page'
import { PeriodPicker } from '../../shared/PeriodPicker'
import { ScInput } from '../../shared/ScInput'
import { config } from '../../conf/config'

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
          superheader={
            <p>
              Cette page liste les numéros de téléphone les plus signalés.{' '}
              <br />
              Un numéro peut apparaitre plusieurs fois, si des consommateurs
              l'ont associé à différentes entreprises.
            </p>
          }
          headerMain={
            <div className="flex w-full gap-2">
              <DebouncedInput
                value={_reportedPhone.filters.phone ?? ''}
                onChange={onPhoneChange}
              >
                {(value, onChange) => (
                  <ScInput
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    fullWidth
                    label="Rechercher un numéro de téléphone"
                    placeholder="ex: 0123456789"
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
              <ExportPhonesPopper
                maxElement={config.reportsLimitForExport}
                filters={_reportedPhone.filters}
              >
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
              head: 'Entreprise',
              sx: (_) => ({
                maxWidth: 100,
              }),
              render: (_) =>
                _.siret ? (
                  <>
                    <p className="">{_.companyName}</p>
                    <p className="text-gray-500">{_.siret}</p>
                  </>
                ) : (
                  <DatatableEmptyCell />
                ),
            },
            {
              id: 'count',
              head: 'Signalements',
              render: (_) => (
                <>
                  <QuickSmallReportSearchLink
                    icon={false}
                    label={
                      _.count === 1
                        ? `${_.count} signalement`
                        : `${_.count} signalements`
                    }
                    reportSearch={{
                      hasPhone: true,
                      phone: _.phone,
                      ...(_.siret
                        ? { hasCompany: true, siretSirenList: [_.siret] }
                        : {}),
                    }}
                  />
                </>
              ),
            },
          ]}
        />
      </>
    </Page>
  )
}
