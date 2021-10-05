import React, {useEffect} from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {useReportedPhonesContext} from '../../core/context/ReportedPhonesContext'
import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {ReportedPhone} from '@betagouv/signalconso-api-sdk-js'
import {Btn, IconBtn} from 'mui-extension/lib'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {ScInput} from '../../shared/Input/ScInput'
import {ExportPhonesPopper} from '../../shared/ExportPopper/ExportPopperBtn'
import {fromNullable} from 'fp-ts/lib/Option'
import {useToast} from '../../core/toast'
import {Icon, makeStyles, Theme, Tooltip} from '@material-ui/core'
import {PeriodPicker} from '../../shared/PeriodPicker/PeriodPicker'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {Txt} from 'mui-extension/lib/Txt/Txt'

const useStyles = makeStyles((t: Theme) => ({
  tdSiret: {
    maxWidth: 200,
  },
}))

export const ReportedPhones = () => {
  const _reportedPhone = useReportedPhonesContext()
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const css = useStyles()
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
              <DebouncedInput
                value={_reportedPhone.filters.phone ?? ''}
                onChange={phone => _reportedPhone.updateFilters(prev => ({...prev, phone}))}
              >
                {(value, onChange) => (
                  <ScInput
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    fullWidth
                    className={cssUtils.marginRight}
                    label={m.phone}
                  />
                )}
              </DebouncedInput>
              <DebouncedInput<[Date | undefined, Date | undefined]>
                value={[_reportedPhone.filters.start, _reportedPhone.filters.end]}
                onChange={([start, end]) =>
                  _reportedPhone.updateFilters(prev => ({...prev, start: start ?? prev.start, end: end ?? prev.end}))
                }
              >
                {(value, onChange) => <PeriodPicker value={value ?? [undefined, undefined]} onChange={onChange} fullWidth />}
              </DebouncedInput>
              <Tooltip title={m.removeAllFilters}>
                <IconBtn color="primary" onClick={_reportedPhone.clearFilters}>
                  <Icon>clear</Icon>
                </IconBtn>
              </Tooltip>
              <ExportPhonesPopper>
                <IconBtn color="primary">
                  <Icon>file_download</Icon>
                </IconBtn>
              </ExportPhonesPopper>
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
              id: 'siret',
              head: m.siret,
              className: css.tdSiret,
              row: _ => (
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
              row: _ => _.count,
            },
            {
              id: 'actions',
              row: _ => (
                <>
                  <NavLink
                    to={siteMap.reports({
                      phone: _.phone,
                      ...(_.siret ? {siretSirenList: [_.siret]} : {}),
                      ...(_.category ? {category: _.category} : {}),
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
    </Page>
  )
}
