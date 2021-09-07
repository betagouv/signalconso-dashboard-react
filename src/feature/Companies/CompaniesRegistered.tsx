import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {cleanObject, Company, CompanySearch, CompanyWithReportsCount, PaginatedSearch} from '../../core/api'
import React, {useEffect} from 'react'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {Icon, InputBase, makeStyles, Theme, Tooltip} from '@material-ui/core'
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
import {ClipboardApi} from '../../core/helper/clipboard'

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
    color: t.palette.text.hint,
  },
  tdAddress: {
    maxWidth: 300,
    ...styleUtils(t).truncate,
  },
  fender: {
    margin: `${t.spacing(1)}px auto ${t.spacing(2)}px auto`,
  },
}))

export interface CompanySearchQs extends PaginatedSearch<any> {
  departments?: string[] | string
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

  const queryString = useQueryString<Partial<CompanySearch>, Partial<CompanySearchQs>>({
    toQueryString: _ => _,
    fromQueryString: _ => mapArrayFromQuerystring(_, ['departments']),
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

  return (
    <Panel>
      <Datatable<CompanyWithReportsCount>
        header={
          <>
            <DebouncedInput
              value={_companies.filters.departments}
              onChange={departments => _companies.updateFilters(prev => ({...prev, departments}))}
            >
              {(value, onChange) => <SelectDepartments values={value} onChange={onChange} className={cssUtils.marginRight}/>}
            </DebouncedInput>
            <DebouncedInput
              value={_companies.filters.identity ?? ''}
              onChange={value => _companies.updateFilters(prev => ({...prev, identity: value}))}
            >
              {(value, onChange) => (
                <InputBase
                  value={value}
                  placeholder={m.companiesSearchPlaceholder}
                  fullWidth
                  className={cssUtils.marginLeft}
                  onChange={e => onChange(e.target.value)}
                />
              )}
            </DebouncedInput>
            <Tooltip title={m.removeAllFilters}>
              <IconBtn color="primary" onClick={_companies.clearFilters}>
                <Icon>clear</Icon>
              </IconBtn>
            </Tooltip>
          </>
        }
        loading={_companies.fetching}
        data={_companies.list?.data}
        paginate={{
          offset: _companies.filters.offset,
          limit: _companies.filters.limit,
          onPaginationChange: pagination => _companies.updateFilters(prev => ({...prev, ...pagination})),
        }}
        total={_companies.list?.totalSize}
        getRenderRowKey={_ => _.siret}
        showColumnsToggle={true}
        rows={[
          {
            head: m.name,
            id: 'siret',
            className: css.tdName,
            row: _ => (
              <>
                <span className={css.tdName_label}>{_.name}</span>
                <br />
                <span className={css.tdName_desc}>{_.siret}</span>
              </>
            ),
          },
          {
            head: m.address,
            id: 'address',
            className: css.tdAddress,
            row: _ => <AddressComponent address={_.address} />,
          },
          {
            head: m.postalCodeShort,
            id: 'postalCode',
            row: _ => (
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
            row: _ => (
              <NavLink to={siteMap.reports({siretSirenList: [_.siret], departments: _companies.filters.departments})}>
                <ScButton color="primary">{formatLargeNumber(_.count)}</ScButton>
              </NavLink>
            ),
          },
          {
            head: '',
            id: 'actions',
            className: cssUtils.txtRight,
            row: _ => (
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
                {connectedUser.isAdmin && (
                  <NavLink to={siteMap.companyAccesses(_.siret)}>
                    <Tooltip title={m.handleAccesses}>
                      <IconBtn color="primary">
                        <Icon>vpn_key</Icon>
                      </IconBtn>
                    </Tooltip>
                  </NavLink>
                )}
              </>
            ),
          },
        ]}
        renderEmptyState={
          <Fender title={m.noCompanyFound} icon="store" className={css.fender}>
            <SelectCompany
              onChange={company => {
                const {siret, name, address, activityCode} = company
                if (name && address) {
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
          </Fender>
        }
      />
    </Panel>
  )
}
