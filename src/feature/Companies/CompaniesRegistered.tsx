import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {cleanObject, Company, CompanySearch, PaginatedSearch} from '@signal-conso/signalconso-api-sdk-js'
import React, {useEffect, useMemo, useState} from 'react'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Badge, Icon, InputBase, ListItemIcon, ListItemText, MenuItem, Theme, Tooltip} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {ScButton} from '../../shared/Button/Button'
import {styleUtils} from '../../core/theme'
import {Fender, IconBtn} from 'mui-extension/lib'
import {mapArrayFromQuerystring, useQueryString} from '../../core/helper/useQueryString'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {fromNullable} from 'fp-ts/lib/Option'
import {useToast} from '../../core/toast'
import {AddressComponent} from '../../shared/Address/Address'
import {SelectCompany} from '../../shared/SelectCompany/SelectCompany'
import {EditAddressDialog} from './EditAddressDialog'
import {useLogin} from '../../core/context/LoginContext'
import {ClipboardApi} from '@alexandreannic/ts-utils/lib/browser/clipboard/ClipboardApi'
import {classes} from '../../core/helper/utils'
import {CompaniesRegisteredFilters} from './CompaniesRegisteredFilters'
import {ScMenu} from '../../shared/Menu/Menu'
import {Txt} from 'mui-extension/lib/Txt/Txt'

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
      return [..._companies.list.data].sort(
        (a, b) => (a.responseRate - b.responseRate) * (sortByResponseRate === 'desc' ? -1 : 1),
      )
    return _companies.list?.data
  }, [_companies.list?.data, sortByResponseRate])

  return (
    <Panel>
      <Datatable
        id="companiesregistered"
        header={
          <DebouncedInput
            value={_companies.filters.identity ?? ''}
            onChange={value => _companies.updateFilters(prev => ({...prev, identity: value}))}
          >
            {(value, onChange) => (
              <InputBase
                value={value}
                placeholder={m.companiesSearchPlaceholder}
                fullWidth
                onChange={e => onChange(e.target.value)}
              />
            )}
          </DebouncedInput>
        }
        actions={
          <>
            <CompaniesRegisteredFilters
              filters={_companies.filters}
              updateFilters={_ => {
                _companies.updateFilters(prev => ({...prev, ..._}))
              }}
            >
              <Tooltip title={m.advancedFilters}>
                <IconBtn color="primary">
                  <Icon>filter_list</Icon>
                </IconBtn>
              </Tooltip>
            </CompaniesRegisteredFilters>
            <Tooltip title={m.removeAllFilters}>
              <IconBtn color="primary" onClick={_companies.clearFilters}>
                <Icon>clear</Icon>
              </IconBtn>
            </Tooltip>
          </>
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
        getRenderRowKey={_ => _.id}
        showColumnsToggle={true}
        columns={[
          {
            head: m.name,
            id: 'siret',
            className: css.tdName,
            render: _ => (
              <Tooltip title={_.name}>
                <span>
                  <NavLink to={siteMap.logged.company(_.id)}>
                    <Txt link className={css.tdName_label}>{_.name}</Txt>
                  </NavLink>
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
            render: _ => (
              <span
                className={classes(
                  cssUtils.txtBold,
                  _.responseRate > 50
                    ? cssUtils.colorSuccess
                    : _.responseRate === 0
                    ? cssUtils.colorError
                    : cssUtils.colorWarning,
                )}
              >
                {_.responseRate} %
              </span>
            ),
          },
          {
            head: m.activityCode,
            id: 'activityCode',
            className: cssUtils.txtRight,
            render: _ => <span>{_?.activityCode}</span>,
          },
          {
            head: '',
            id: 'actions',
            stickyEnd: true,
            className: cssUtils.txtRight,
            render: _ => (
              <>
                <Badge color="error" badgeContent=" " variant="dot" overlap="circular">
                  <NavLink to={siteMap.logged.company(_.id)}>
                    <IconBtn color="primary">
                      <Icon>query_stats</Icon>
                    </IconBtn>
                  </NavLink>
                </Badge>
                <ScMenu>
                  <NavLink to={siteMap.logged.companyAccesses(_.siret)}>
                    <MenuItem>
                      <ListItemIcon>
                        <Icon>vpn_key</Icon>
                      </ListItemIcon>
                      <ListItemText>{m.handleAccesses}</ListItemText>
                    </MenuItem>
                  </NavLink>
                  <MenuItem onClick={() => copyAddress(_)}>
                    <ListItemIcon>
                      <Icon>content_copy</Icon>
                    </ListItemIcon>
                    <ListItemText>{m.copyAddress}</ListItemText>
                  </MenuItem>
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
                      <MenuItem>
                        <ListItemIcon>
                          <Icon>edit</Icon>
                        </ListItemIcon>
                        <ListItemText>{m.editAddress}</ListItemText>
                      </MenuItem>
                    </EditAddressDialog>
                  )}
                </ScMenu>
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
