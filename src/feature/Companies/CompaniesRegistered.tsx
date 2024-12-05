import {
  Badge,
  Box,
  Icon,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AlbertActivityLabel } from 'shared/AlbertActivityLabel'
import { ScInput } from 'shared/ScInput'
import { Fender, IconBtn, Txt } from '../../alexlibs/mui-extension'
import {
  Company,
  CompanySearch,
  CompanyUpdate,
  CompanyWithReportsCount,
} from '../../core/client/company/Company'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useToast } from '../../core/context/toastContext'
import { cleanObject } from '../../core/helper'
import {
  mapArrayFromQuerystring,
  useQueryString,
} from '../../core/helper/useQueryString'
import { useI18n } from '../../core/i18n'
import { Address, Id, Paginate, PaginatedSearch } from '../../core/model'
import {
  ActivatedCompanySearchQueryKeys,
  useActivatedCompanySearchQuery,
} from '../../core/queryhooks/companyQueryHooks'
import { siteMap } from '../../core/siteMap'
import { styleUtils, sxUtils } from '../../core/theme'
import { AddressComponent } from '../../shared/Address'
import { ScButton } from '../../shared/Button'
import { Datatable } from '../../shared/Datatable/Datatable'
import { DebouncedInput } from '../../shared/DebouncedInput'
import { ScMenu } from '../../shared/Menu'
import { SelectCompanyDialog } from '../../shared/SelectCompany/SelectCompanyDialog'
import { CompaniesRegisteredFilters } from './CompaniesRegisteredFilters'
import { EditAddressDialog } from './EditAddressDialog'
import { MassImport } from './MassImport'

interface CompanySearchQs extends PaginatedSearch<any> {
  departments?: string[] | string
  activityCodes?: string[] | string
  identity?: string
}

export const CompaniesRegistered = () => {
  const queryString = useQueryString<
    Partial<CompanySearch>,
    Partial<CompanySearchQs>
  >({
    toQueryString: (_) => _,
    fromQueryString: mapArrayFromQuerystring(['activityCodes', 'departments']),
  })
  const { m, formatLargeNumber } = useI18n()
  const queryClient = useQueryClient()
  const { connectedUser, api: apiSdk } = useConnectedContext()
  const _companies = useActivatedCompanySearchQuery({
    offset: 0,
    limit: 25,
    ...queryString.get(),
  })

  const updateRegisteredCompanyAddress = (id: Id, address: Address) => {
    queryClient.setQueryData(
      ActivatedCompanySearchQueryKeys,
      (companies: Paginate<CompanyWithReportsCount>) => {
        if (!companies) return companies
        const company = companies?.entities.find((company) => company.id === id)
        if (company) {
          company.address = address
          return { ...companies }
        }
        return companies
      },
    )
  }

  const _companyUpdateAddress = useMutation({
    mutationFn: (params: { id: Id; update: CompanyUpdate }) =>
      apiSdk.secured.company
        .updateAddress(params.id, params.update)
        .then((_) => {
          updateRegisteredCompanyAddress(params.id, params.update.address)
          return _
        }),
    onSuccess: () => toastSuccess(m.editedAddress),
  })
  const _companyCreate = useMutation({
    mutationFn: apiSdk.secured.company.create,
    onSuccess: () => toastSuccess(m.companyCreated),
  })
  const { toastError, toastSuccess } = useToast()
  const [sortByResponseRate, setSortByResponseRate] = useState<
    'asc' | 'desc' | undefined
  >()

  useEffect(() => {
    queryString.update(cleanObject(_companies.filters))
  }, [_companies.filters])

  const copyAddress = async (c: Company) => {
    const a = c.address
    const address = `${c.name} - ${a.number} ${a.street} ${a.addressSupplement} ${a.postalCode} ${a.city} (${c.siret})`
    const cleanedAddress = address
      .replaceAll('undefined', '')
      .replaceAll(/[\s]{1,}/g, ' ')
    try {
      await navigator.clipboard.writeText(cleanedAddress)
      toastSuccess(m.succesCopy)
    } catch (err) {
      console.error("Échec de la copie de l'adresse : ", err)
      toastError({ message: m.errorCopy })
    }
  }

  const data = useMemo(() => {
    if (sortByResponseRate && _companies.result.data)
      return [..._companies.result.data.entities].sort(
        (a, b) =>
          (a.responseRate - b.responseRate) *
          (sortByResponseRate === 'desc' ? -1 : 1),
      )
    return _companies.result.data?.entities
  }, [_companies.result.data?.entities, sortByResponseRate])

  const onInputChange = useCallback((value: string) => {
    _companies.updateFilters((prev) => ({ ...prev, identity: value }))
    // TRELLO-1391 The object _companies change all the time.
    // If we put it in dependencies, it causes problems with the debounce,
    // and the search input "stutters" when typing fast
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const computeTitle = (company: Company) => {
    const firstLine = company.commercialName
      ? `${company.name} (${company.commercialName})`
      : company.name
    const secondLine = company.establishmentCommercialName
      ? `${company.brand} - ${company.establishmentCommercialName}`
      : company.brand
    if (secondLine) {
      return (
        <>
          {firstLine}
          <br />
          {secondLine}
        </>
      )
    } else {
      return firstLine
    }
  }

  return (
    <>
      <Datatable
        id="companiesregistered"
        superheader={
          <div className="flex gap-2 justify-between items-center">
            <div>
              <p>
                Cette page liste toutes les sociétés qui existent dans
                SignalConso
              </p>
              <p className="text-gray-500 italic">
                Elles ont eu au moins un signalement, ou ont été ajoutées
                manuellement par un admin.
              </p>
            </div>
            {connectedUser.isAdmin && (
              <MassImport>
                <ScButton
                  icon="meeting_room"
                  variant="outlined"
                  color="primary"
                >
                  Ouvrir des accès
                </ScButton>
              </MassImport>
            )}
          </div>
        }
        headerMain={
          <div className="mb-2 w-full">
            <DebouncedInput
              value={_companies.filters.identity ?? ''}
              onChange={onInputChange}
            >
              {(value, onChange) => (
                <ScInput
                  value={value}
                  placeholder={m.companiesSearchPlaceholder}
                  fullWidth
                  onChange={(e) => onChange(e.target.value)}
                />
              )}
            </DebouncedInput>
          </div>
        }
        actions={
          <>
            <CompaniesRegisteredFilters
              filters={_companies.filters}
              updateFilters={(_) => {
                _companies.updateFilters((prev) => ({ ...prev, ..._ }))
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
          onSortChange: (_) =>
            setSortByResponseRate(
              _.sortBy === 'responseRate' ? _.orderBy : undefined,
            ),
        }}
        loading={_companies.result.isFetching}
        data={data}
        paginate={{
          offset: _companies.filters.offset,
          limit: _companies.filters.limit,
          onPaginationChange: (pagination) =>
            _companies.updateFilters((prev) => ({ ...prev, ...pagination })),
        }}
        total={_companies.result.data?.totalCount}
        getRenderRowKey={(_) => _.id}
        showColumnsToggle={true}
        columns={[
          {
            head: m.name,
            id: 'siret',
            sx: (_) => ({
              lineHeight: 1.4,
              maxWidth: 170,
            }),
            render: (_) => (
              <Tooltip title={computeTitle(_)}>
                <div className="flex flex-col">
                  <NavLink
                    to={siteMap.logged.company(_.id).stats.valueAbsolute}
                  >
                    <Txt link sx={{ marginBottom: '-1px' }}>
                      {_.name}
                    </Txt>
                  </NavLink>
                  {_.albertActivityLabel && (
                    <AlbertActivityLabel smaller withExplainButton={false}>
                      {_.albertActivityLabel}
                    </AlbertActivityLabel>
                  )}
                  {_.brand && (
                    <Box
                      component="span"
                      sx={{
                        fontSize: (t) => styleUtils(t).fontSize.small,
                        fontStyle: 'italic',
                        color: (t) => t.palette.text.primary,
                      }}
                    >
                      {_.brand}
                    </Box>
                  )}
                  <Box
                    component="span"
                    sx={{
                      fontSize: (t) => styleUtils(t).fontSize.small,
                      color: (t) => t.palette.text.disabled,
                    }}
                  >
                    {_.siret}
                  </Box>
                </div>
              </Tooltip>
            ),
          },
          {
            head: m.address,
            id: 'address',
            sx: (_) => ({ maxWidth: 260, ...sxUtils.truncate }),
            render: (_) => (
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
            render: (_) => (
              <>
                <span>{_.address.postalCode?.slice(0, 2)}</span>
                <Box
                  component="span"
                  sx={{ color: (t) => t.palette.text.disabled }}
                >
                  {_.address.postalCode?.slice(2, 5)}
                </Box>
              </>
            ),
          },
          {
            head: m.reports,
            id: 'count',
            sx: (_) => ({ textAlign: 'right' }),
            render: (_) => (
              <NavLink
                to={siteMap.logged.reports({
                  hasCompany: true,
                  siretSirenList: [_.siret],
                  departments: _companies.filters.departments,
                })}
              >
                <ScButton color="primary">
                  {formatLargeNumber(_.count)}
                </ScButton>
              </NavLink>
            ),
          },
          {
            head: m.responseRate,
            id: 'responseRate',
            sx: (_) => ({ textAlign: 'right' }),
            render: (_) => (
              <Box
                component="span"
                sx={{
                  fontWeight: (t) => t.typography.fontWeightBold,
                  ...(_.responseRate > 50
                    ? {
                        color: (t) => t.palette.success.light,
                      }
                    : _.responseRate === 0
                      ? {
                          color: (t) => t.palette.error.light,
                        }
                      : {
                          color: (t) => t.palette.warning.light,
                        }),
                }}
              >
                {_.responseRate} %
              </Box>
            ),
          },
          {
            head: m.activityCode,
            id: 'activityCode',
            sx: (_) => ({ textAlign: 'right' }),
            render: (_) => <span>{_?.activityCode}</span>,
          },
          {
            head: '',
            id: 'actions',
            stickyEnd: true,
            sx: (_) => sxUtils.tdActions,
            render: (_) => (
              <>
                <Badge
                  color="error"
                  badgeContent=" "
                  variant="dot"
                  overlap="circular"
                >
                  <NavLink
                    to={siteMap.logged.company(_.id).stats.valueAbsolute}
                  >
                    <IconBtn color="primary">
                      <Icon>query_stats</Icon>
                    </IconBtn>
                  </NavLink>
                </Badge>
                <ScMenu>
                  <NavLink
                    to={siteMap.logged.company(_.id).accesses.valueAbsolute}
                  >
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
                      onChange={(form) => {
                        const {
                          activationDocumentRequired = false,
                          ...address
                        } = form
                        return _companyUpdateAddress.mutateAsync({
                          id: _.id,
                          update: { address, activationDocumentRequired },
                        })
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
          <Fender
            title={m.noCompanyFound}
            icon="store"
            sx={{ margin: 'auto', mt: 1, mb: 2 }}
          >
            {connectedUser.isAdmin && (
              <SelectCompanyDialog
                onChange={(company) => {
                  const {
                    siret,
                    name,
                    address,
                    activityCode,
                    isOpen,
                    isHeadOffice,
                    isPublic,
                  } = company
                  if (name && address && siret) {
                    _companyCreate.mutateAsync({
                      siret,
                      name,
                      address,
                      activityCode,
                      isOpen,
                      isHeadOffice,
                      isPublic,
                    })
                  } else {
                    toastError({ message: m.cannotCreateCompanyMissingInfo })
                  }
                }}
              >
                <ScButton
                  variant="contained"
                  color="primary"
                  icon="add"
                  sx={{ mt: 1 }}
                >
                  {m.registerACompany}
                </ScButton>
              </SelectCompanyDialog>
            )}
          </Fender>
        }
      />
    </>
  )
}
