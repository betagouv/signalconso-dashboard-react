import React, {useEffect} from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {useReportedPhonesContext} from '../../core/context/ReportedPhonesContext'
import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {ReportedPhone, toQueryString} from '../../core/api'
import {Btn, IconBtn} from 'mui-extension/lib'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {Datepicker} from '../../shared/Datepicker/Datepicker'
import {addDays, subDays} from 'date-fns'
import {Icon, TextField, Tooltip} from '@material-ui/core'
import {ScInput} from '../../shared/Input/ScInput'

export const ReportedPhones = () => {
  const _reportedPhone = useReportedPhonesContext()
  const {m} = useI18n()
  const cssUtils = useUtilsCss()

  useEffect(() => {
    _reportedPhone.fetch()
  }, [])

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
              <Tooltip title={m.exportInXLS}>
                <IconBtn onClick={_reportedPhone.extract} className={cssUtils.marginLeft}>
                  <Icon>file_download</Icon>
                </IconBtn>
              </Tooltip>
            </>
          }
          sortBy={_reportedPhone.filters.sortBy!}
          orderBy={_reportedPhone.filters.orderBy}
          onSortChange={(sort: any) => _reportedPhone.updateFilters(prev => ({...prev, ...sort}))}
          onPaginationChange={pagination => _reportedPhone.updateFilters(prev => ({...prev, ...pagination}))}
          total={_reportedPhone.list?.totalSize}
          offset={_reportedPhone.filters.offset}
          limit={_reportedPhone.filters.limit}
          loading={_reportedPhone.fetching}
          data={_reportedPhone.list?.data}
          rows={[
            {
              name: 'phone',
              head: m.phone,
              row: _ => _.phone,
            },
            {
              name: 'category',
              head: m.category,
              row: _ => _.category,
            },
            {
              name: 'companyName',
              head: m.company,
              row: _ => _.companyName,
            },
            {
              name: 'siret',
              head: m.siret,
              row: _ => _.siret,
            },
            {
              name: 'count',
              head: m.reportsCount,
              row: _ => _.count,
            },
            {
              name: 'actions',
              row: _ => (
                <>
                  <NavLink to={siteMap.reports + toQueryString({
                    phone: _.phone, siret: _.siret
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
