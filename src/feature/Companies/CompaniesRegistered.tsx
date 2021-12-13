import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {cleanObject, Company, CompanySearch, PaginatedSearch} from '@signal-conso/signalconso-api-sdk-js'
import React, {useEffect, useMemo, useState} from 'react'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Grid, Icon, Theme, Tooltip} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {ScButton} from '../../shared/Button/Button'
import {styleUtils} from '../../core/theme'
import {Fender, IconBtn} from 'mui-extension/lib'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'
import {mapArrayFromQuerystring, useQueryString} from '../../core/helper/useQueryString'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {fromNullable} from 'fp-ts/lib/Option'
import {useToast} from '../../core/toast'
import {AddressComponent} from '../../shared/Address/Address'
import {SelectCompany} from '../../shared/SelectCompany/SelectCompany'
import {EditAddressDialog} from './EditAddressDialog'
import {useLogin} from '../../core/context/LoginContext'
import {ClipboardApi} from '@alexandreannic/ts-utils/lib/browser/clipboard/ClipboardApi'
import {SelectActivityCode} from '../../shared/SelectActivityCode/SelectActivityCode'
import {ScInput} from '../../shared/Input/ScInput'
import {classes} from '../../core/helper/utils'

const useStyles = makeStyles((t: Theme) => ({
  tdName_label: {
    fontWeight: 'bold',
    marginBottom: -1,
  },
  tdName: {
    lineHeight: 1.4,
    maxWidth: 170,
  },
  tdName_desc: {
    fontSize: t.typography.fontSize * 0.875,
    color: t.palette.text.disabled,
  },
  tdAddress: {
    maxWidth: 260,
    ...styleUtils(t).truncate,
  },
  fender: {
    margin: `${t.spacing(1)}px auto ${t.spacing(2)}px auto`,
  },
}))

export interface CompanySearchQs extends PaginatedSearch<any> {
  departments?: string[] | string
  activityCodes?: string[] | string
  identity?: string
}

export const CompaniesRegistered = () => {
  const {m, formatLargeNumber} = useI18n()
  const _companies = useCompaniesContext().activated
  const _companyUpdateAddress = useCompaniesContext().updateAddress
  const _companyCreate = useCompaniesContext().create
  const cssUtils = useCssUtils()
  const css = useStyles()
  const {toastError, toastSuccess} = useToast()
  const {connectedUser} = useLogin()
  const [sortByResponseRate, setSortByResponseRate] = useState<'asc' | 'desc' | undefined>()

  const queryString = useQueryString<Partial<CompanySearch>, Partial<CompanySearchQs>>({
    toQueryString: _ => _,
    fromQueryString: mapArrayFromQuerystring(['activityCodes', 'departments']),
  })

  useEffect(() => {
    _companies.updateFilters({..._companies.initialFilters, ...queryString.get()})
  }, [])

  useEffect(() => {
    queryString.update(cleanObject(_companies.filters))
  }, [_companies.filters])

  useEffect(() => {
    fromNullable(_companies.error).map(toastError)
    fromNullable(_companyCreate.error).map(toastError)
  }, [_companies.error, _companyCreate.error])

  const copyAddress = (c: Company) => {
    const a = c.address
    const address = `${c.name} - ${a.number} ${a.street} ${a.addressSupplement} ${a.postalCode} ${a.city} (${c.siret})`
    ClipboardApi.copy(address.replaceAll('undefined', '').replaceAll(/[\s]{1,}/g, ' '))
    toastSuccess(m.addressCopied)
  }

  const data = useMemo(() => {
    if (sortByResponseRate && _companies.list)
      return [..._companies.list.data].sort((a, b) => (a.responseRate - b.responseRate) * (sortByResponseRate === 'desc' ? -1 : 1))
    return _companies.list?.data
  }, [_companies.list?.data, sortByResponseRate])

  return (
    <Panel>
      <Datatable
        id="companiesregistered"
        header={
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs={12} md={4}>
              <DebouncedInput
                value={_companies.filters.identity ?? ''}
                onChange={value => _companies.updateFilters(prev => ({...prev, identity: value}))}
              >
                {(value, onChange) => (
                  <ScInput
                    value={value}
                    placeholder={m.companiesSearchPlaceholder}
                    fullWidth
                    onChange={e => onChange(e.target.value)}
                  />
                )}
              </DebouncedInput>
            </Grid>
            <Grid item xs={12} md={4}>
              <DebouncedInput
                value={_companies.filters.departments}
                onChange={departments => _companies.updateFilters(prev => ({...prev, departments}))}
              >
                {(value, onChange) =>
                  <SelectDepartments
                    values={value}
                    fullWidth
                    onChange={onChange}
                    className={cssUtils.marginRight}
                  />
                }
              </DebouncedInput>
            </Grid>
            <Grid item xs={12} md={4}>
              <DebouncedInput
                value={_companies.filters.activityCodes}
                onChange={activityCodes => _companies.updateFilters(prev => ({...prev, activityCodes}))}
              >
                {(value, onChange) =>
                  <SelectActivityCode
                    fullWidth
                    label={m.codeNaf}
                    value={value}
                    onChange={(a, b) => onChange(b)}
                  />
                }
              </DebouncedInput>
            </Grid>
          </Grid>
        }
        actions={
          <Tooltip title={m.removeAllFilters}>
            <IconBtn color="primary" onClick={_companies.clearFilters}>
              <Icon>clear</Icon>
            </IconBtn>
          </Tooltip>
        }
        sort={{
          sortableColumns: ['responseRate'],
          sortBy: sortByResponseRate ? 'responseRate' : undefined,
          orderBy: sortByResponseRate,
          onSortChange: _ => setSortByResponseRate(_.sortBy === 'responseRate' ? _.orderBy : undefined),
        }}
        loading={_companies.fetching}
        data={data}
        paginate={{
          offset: _companies.filters.offset,
          limit: _companies.filters.limit,
          onPaginationChange: pagination => _companies.updateFilters(prev => ({...prev, ...pagination})),
        }}
        total={_companies.list?.totalSize}
        getRenderRowKey={_ => _.siret}
        showColumnsToggle={true}
        columns={[
          {
            head: m.name,
            id: 'siret',
            className: css.tdName,
            render: _ => (
              <Tooltip title={_.name}>
                <span>
                  <span className={css.tdName_label}>{_.name}</span>
                  <br />
                  <span className={css.tdName_desc}>{_.siret}</span>
                </span>
              </Tooltip>
            ),
          },
          {
            head: m.address,
            id: 'address',
            className: css.tdAddress,
            render: _ => (
              <Tooltip title={<AddressComponent address={_.address} />}>
                <span>
                  <AddressComponent address={_.address} />
                </span>
              </Tooltip>
            ),
          },
          {
            head: m.postalCodeShort,
            id: 'postalCode',
            render: _ => (
              <>
                <span>{_.address.postalCode?.slice(0, 2)}</span>
                <span className={cssUtils.colorDisabled}>{_.address.postalCode?.substr(2, 5)}</span>
              </>
            ),
          },
          {
            head: m.reports,
            id: 'count',
            className: cssUtils.txtRight,
            render: _ => (
              <NavLink to={siteMap.logged.reports({siretSirenList: [_.siret], departments: _companies.filters.departments})}>
                <ScButton color="primary">{formatLargeNumber(_.count)}</ScButton>
              </NavLink>
            ),
          },
          {
            head: m.responseRate,
            id: 'responseRate',
            className: cssUtils.txtRight,
            render: _ =>
              <span className={classes(cssUtils.txtBold, _.responseRate > 50 ?
                cssUtils.colorSuccess : _.responseRate === 0 ?
                  cssUtils.colorError : cssUtils.colorWarning)}>
                  {_.responseRate} %
              </span>
            ,
          },
          {
            head: m.activityCode,
            id: 'activityCode',
            className: cssUtils.txtRight,
            render: _ =>
                <span>{_?.activityCode}</span>
            ,
          },
          {
            head: '',
            id: 'actions',
            stickyEnd: true,
            className: cssUtils.txtRight,
            render: _ => (
              <>
                <Tooltip title={m.copyAddress}>
                  <IconBtn color="primary" onClick={() => copyAddress(_)}>
                    <Icon>content_copy</Icon>
                  </IconBtn>
                </Tooltip>
                {connectedUser.isAdmin && (
                  <EditAddressDialog
                    address={_.address}
                    onChangeError={_companyUpdateAddress.error?.message}
                    onChange={form => {
                      const {activationDocumentRequired = false, ...address} = form
                      return _companyUpdateAddress
                        .fetch({}, _.id, {address, activationDocumentRequired})
                        .then(() => toastSuccess(m.editedAddress))
                    }}
                  >
                    <Tooltip title={m.editAddress}>
                      <IconBtn color="primary">
                        <Icon>edit</Icon>
                      </IconBtn>
                    </Tooltip>
                  </EditAddressDialog>
                )}
                <NavLink to={siteMap.logged.companyAccesses(_.siret)}>
                  <Tooltip title={m.handleAccesses}>
                    <IconBtn color="primary">
                      <Icon>vpn_key</Icon>
                    </IconBtn>
                  </Tooltip>
                </NavLink>
                <NavLink to={siteMap.logged.company(_.id)}>
                  <IconBtn color="primary">
                    <Icon>chevron_right</Icon>
                  </IconBtn>
                </NavLink>
              </>
            ),
          },
        ]}
        renderEmptyState={
          <Fender title={m.noCompanyFound} icon="store" className={css.fender}>
            {connectedUser.isAdmin && (
              <SelectCompany
                onChange={company => {
                  const {siret, name, address, activityCode} = company
                  if (name && address && siret) {
                    _companyCreate.fetch({}, {siret, name, address, activityCode}).then(() => toastSuccess(m.companyCreated))
                  } else {
                    toastError({message: m.cannotCreateCompanyMissingInfo})
                  }
                }}
              >
                <ScButton variant="contained" color="primary" icon="add" className={cssUtils.marginTop}>
                  {m.registerACompany}
                </ScButton>
              </SelectCompany>
            )}
          </Fender>
        }
      />
    </Panel>
  )
}
