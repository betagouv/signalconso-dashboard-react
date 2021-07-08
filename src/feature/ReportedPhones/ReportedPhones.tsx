import React, {useEffect} from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {useReportedPhonesContext} from '../../core/context/ReportedPhonesContext'
import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {ReportedPhone} from '../../core/api'
import {Btn} from 'mui-extension/lib'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Datepicker} from '../../shared/Datepicker/Datepicker'
import {addDays, subDays} from 'date-fns'
import {ScInput} from '../../shared/Input/ScInput'
import {ExportPhonesPopper} from '../../shared/ExportPopper/ExportPopperBtn'
import {fromNullable} from 'fp-ts/lib/Option'
import {useToast} from '../../core/toast'

export const ReportedPhones = () => {
  const _reportedPhone = useReportedPhonesContext()
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const {toastError} = useToast()

  useEffect(() => {
    _reportedPhone.fetch()
  }, [])

  useEffect(() => {
    fromNullable(_reportedPhone.error).map(toastError)
  }, [_reportedPhone.error])

  return (
    <Page>
      <PageTitle>{m.reportedPhoneTitle}</PageTitle>
      <Panel>
        <Datatable<ReportedPhone>
          showColumnsToggle
          header={
            <>
              <ScInput
                fullWidth
                value={_reportedPhone.filters.phone}
                onChange={event => _reportedPhone.updateFilters(prev => ({...prev, phone: event.target.value}))}
                className={cssUtils.marginRight}
                label={m.phone}
              />
              <Datepicker
                className={cssUtils.marginRight}
                fullWidth
                label={m.start}
                value={_reportedPhone.filters.start}
                onChange={start => {
                  _reportedPhone.updateFilters(prev => {
                    if (prev.end && start.getTime() > prev.end.getTime()) {
                      return {...prev, start, end: addDays(start, 1)}
                    }
                    return {...prev, start}
                  })
                }}
              />
              <Datepicker
                fullWidth
                value={_reportedPhone.filters.end}
                onChange={end => _reportedPhone.updateFilters(prev => {
                  if (prev.start && prev.start.getTime() > end.getTime()) {
                    return {...prev, start: subDays(end, 1), end}
                  }
                  return {...prev, end}
                })}
                label={m.end}
              />
              <ExportPhonesPopper/>
            </>
          }
          sort={{
            sortBy: _reportedPhone.filters.sortBy!,
            orderBy: _reportedPhone.filters.orderBy!,
            onSortChange: (sort: any) => _reportedPhone.updateFilters(prev => ({...prev, ...sort})),
          }}
          paginate={{
            onPaginationChange: pagination => _reportedPhone.updateFilters(prev => ({...prev, ...pagination})),
            offset: _reportedPhone.filters.offset,
            limit: _reportedPhone.filters.limit,
          }}
          total={_reportedPhone.list?.totalSize}
          loading={_reportedPhone.fetching}
          data={_reportedPhone.list?.data}
          rows={[
            {
              id: 'phone',
              head: m.phone,
              row: _ => _.phone,
            },
            {
              id: 'category',
              head: m.category,
              row: _ => _.category,
            },
            {
              id: 'companyName',
              head: m.company,
              row: _ => _.companyName,
            },
            {
              id: 'siret',
              head: m.siret,
              row: _ => _.siret,
            },
            {
              id: 'count',
              head: m.reportsCount,
              row: _ => _.count,
            },
            {
              id: 'actions',
              row: _ => (
                <>
                  <NavLink to={siteMap.reports({
                    phone: _.phone,
                    ...(_.siret ? {siretSirenList: [_.siret]} : {}),
                    ...(_.category ? {category: _.category} : {}),
                  })}>
                    <Btn size="small" color="primary" variant="outlined">
                      {m.see}
                    </Btn>
                  </NavLink>
                </>
              )
            }
          ]}
        />
      </Panel>
    </Page>
  )
}
