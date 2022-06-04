import React, {useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Box, Chip, FormControlLabel, Icon, InputBase, Switch, Tooltip} from '@mui/material'
import {useToast} from '../../core/toast'
import {fromNullable} from 'fp-ts/lib/Option'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {useReportedWebsiteWithCompanyContext} from '../../core/context/ReportedWebsitesContext'
import {Country, WebsiteKind} from '@signal-conso/signalconso-api-sdk-js'
import {IconBtn, makeSx} from 'mui-extension'
import {ScSelect} from '../../shared/Select/Select'
import {SelectCompany} from '../../shared/SelectCompany/SelectCompany'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useConstantContext} from '../../core/context/ConstantContext'
import {SelectCountry} from './SelectCountry'
import {classes} from '../../core/helper/utils'
import {ScMenuItem} from '../MenuItem/MenuItem'
import {sxUtils} from '../../core/theme'

const iconWidth = 50

const css = makeSx({
  tdName_label: {
    fontWeight: 'bold',
    marginBottom: -1,
    maxWidth: 200
  },
  tdName_desc: {
    fontSize: t =>  t.typography.fontSize * 0.875,
    color: t => t.palette.text.disabled
  },
  chipEnterprise: {
      height: 42,
      borderRadius: 42,
    },
    flag: {
      color: 'rgba(0, 0, 0, 1)',
      fontSize: 18,
      textAlign: 'center',
    },
    iconWidth: {
      width: iconWidth,
    },
    status: {
      maxWidth: 180,
    },
  })

const countryToFlag = (isoCode: string) => {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode
}

const useAnchoredMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = (event: any) => setAnchorEl(event.currentTarget)
  const close = () => setAnchorEl(null)
  return {open, close, element: anchorEl}
}

export const ReportedCompaniesWebsites = () => {
  const {m, formatDate} = useI18n()
  const _countries = useConstantContext().countries
  const _fetch = useReportedWebsiteWithCompanyContext().getWebsiteWithCompany
  const _remove = useReportedWebsiteWithCompanyContext().remove
  const _updateStatus = useReportedWebsiteWithCompanyContext().update
  const _updateCompany = useReportedWebsiteWithCompanyContext().updateCompany
  const _updateCountry = useReportedWebsiteWithCompanyContext().updateCountry
  const [countries, setCountries] = useState<Country[]>([])
  const countriesAnchor = useAnchoredMenu()
  const cssUtils = useCssUtils()
  const {toastError, toastInfo, toastSuccess} = useToast()

  useEffect(() => {
    _fetch.updateFilters({..._fetch.initialFilters})
  }, [])

  useEffect(() => {
    _fetch.fetch()
  }, [])

  useEffect(() => {
    _countries.fetch({}).then(setCountries)
  }, [])

  useEffect(() => {
    fromNullable(_fetch.error).map(toastError)
    fromNullable(_updateStatus.error).map(toastError)
    fromNullable(_remove.error).map(toastError)
  }, [_fetch.error, _updateStatus.error, _remove.error])

  return (
    <Panel>
      <Datatable
        id="reportcompanieswebsites"
        header={
          <>
            <DebouncedInput
              value={_fetch.filters.host ?? ''}
              onChange={host => _fetch.updateFilters(prev => ({...prev, host: host}))}
            >
              {(value, onChange) => (
                <InputBase
                  value={value}
                  placeholder={m.searchByHost + '...'}
                  fullWidth
                  sx={{ml: 1}}
                  onChange={e => onChange(e.target.value)}
                />
              )}
            </DebouncedInput>
            <DebouncedInput
              value={_fetch.filters.kinds}
              onChange={(kinds: WebsiteKind[]) => _fetch.updateFilters(prev => ({...prev, kinds}))}
            >
              {(value, onChange) => (
                <ScSelect
                  value={value}
                  onChange={e => onChange(e.target.value as WebsiteKind[])}
                  fullWidth
                  multiple
                  sx={css.status}
                >
                  {[WebsiteKind.PENDING, WebsiteKind.DEFAULT].map(kind => (
                    <ScMenuItem key={kind} value={kind}>
                      {kind === WebsiteKind.PENDING ? m.notValidated : m.validated}
                    </ScMenuItem>
                  ))}
                </ScSelect>
              )}
            </DebouncedInput>
          </>
        }
        actions={
          <Tooltip title={m.removeAllFilters}>
            <IconBtn color="primary" onClick={_fetch.clearFilters}>
              <Icon>clear</Icon>
            </IconBtn>
          </Tooltip>
        }
        loading={_fetch.fetching}
        total={_fetch.list?.totalSize}
        paginate={{
          limit: _fetch.filters.limit,
          offset: _fetch.filters.offset,
          onPaginationChange: pagination => _fetch.updateFilters(prev => ({...prev, ...pagination})),
        }}
        getRenderRowKey={_ => _.id}
        data={_fetch.list?.data}
        showColumnsToggle={true}
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
            head: m.creation,
            id: 'creationDate',
            render: _ => <>{formatDate(_.creationDate)}</>,
          },
          {
            head: m.company,
            id: 'company',
            render: _ => (
              <SelectCompany
                siret={_.company?.siret}
                onChange={company => {
                  if (_.company?.siret === company.siret) {
                    toastInfo(m.alreadySelectedCompany(company.name))
                  } else {
                    _updateCompany
                      .fetch({}, _.id, {
                        siret: company.siret,
                        name: company.name,
                        address: company.address,
                        activityCode: company.activityCode,
                      })
                      .then(_ => _fetch.fetch({clean: false}))
                  }
                }}
              >
                {_.company ? (
                  <Tooltip title={_.company.name}>
                    <Chip
                      variant={'outlined'}
                      sx={css.chipEnterprise}
                      label={
                        <div>
                          <Txt truncate sx={css.tdName_label} block>
                            {_.company.name}
                          </Txt>
                          <Box component="span" sx={css.tdName_desc}>{_.company.siret}</Box>
                        </div>
                      }
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title={m.linkCompany}>
                    <Chip
                      variant={'outlined'}
                      sx={css.chipEnterprise}
                      label={
                        <div>
                          <Box component="span" sx={css.tdName_desc}>{m.noAssociation}</Box>
                        </div>
                      }
                    />
                  </Tooltip>
                )}
              </SelectCompany>
            ),
          },
          {
            head: m.foreignCountry,
            id: 'company_country',
            render: _ => (
              <SelectCountry
                country={_.companyCountry}
                onChange={companyCountry => {
                  if (_.companyCountry === companyCountry) {
                    toastInfo(m.alreadySelectedCountry(companyCountry?.name))
                  } else {
                    _updateCountry.fetch({}, _.id, companyCountry).then(_ => _fetch.fetch({clean: false}))
                  }
                }}
              >
                {_.companyCountry ? (
                  <Tooltip title={m.linkCountry}>
                    <Chip
                      variant={'outlined'}
                      sx={css.chipEnterprise}
                      label={
                        <div>
                          <Txt truncate block>
                            <span className={classes(css.flag, css.iconWidth)}>{countryToFlag(_.companyCountry.code)}</span>
                            &nbsp;
                            <Box sx={css.tdName_desc}>{_.companyCountry.name}</Box>
                          </Txt>
                        </div>
                      }
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title={m.linkCountry}>
                    <Chip
                      variant={'outlined'}
                      sx={css.chipEnterprise}
                      label={
                        <div>
                          <Box sx={css.tdName_desc}>{m.noAssociation}</Box>
                        </div>
                      }
                    />
                  </Tooltip>
                )}
              </SelectCountry>
            ),
          },
          {
            head: m.status,
            id: 'status',
            render: _ => (
              <FormControlLabel
                control={<Switch checked={_.kind === WebsiteKind.DEFAULT} />}
                onChange={() => {
                  _updateStatus
                    .fetch({}, _.id, _.kind === WebsiteKind.DEFAULT ? WebsiteKind.PENDING : WebsiteKind.DEFAULT)
                    .then(_ => _fetch.fetch({clean: false}))
                }}
                label=""
              />
            ),
          },
          {
            id: 'actions',
            stickyEnd: true,
            sx: sxUtils.tdActions,
            render: _ => (
              <IconBtn sx={{color: t => t.palette.text.disabled}} onClick={() => _remove.fetch({}, _.id).then(_ => _fetch.fetch())}>
                <Icon>delete</Icon>
              </IconBtn>
            ),
          },
        ]}
      />
    </Panel>
  )
}
