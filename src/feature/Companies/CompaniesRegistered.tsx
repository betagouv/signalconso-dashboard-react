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
import { Link, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlbertActivityLabel } from 'shared/albert/AlbertActivityLabel'
import { Fender, IconBtn, Txt } from '../../alexlibs/mui-extension'
import {
  Company,
  CompanySearch,
  CompanyUpdate,
  CompanyWithReportsCount,
} from '../../core/client/company/Company'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useToast } from '../../core/context/toast/toastContext'
import { cleanObject } from '../../core/helper'
import { useI18n } from '../../core/i18n'
import { Address, Id, Paginate } from '../../core/model'
import {
  ActivatedCompanySearchQueryKeys,
  useActivatedCompanySearchQuery,
} from '../../core/queryhooks/companyQueryHooks'
import { styleUtils, sxUtils } from '../../core/theme'
import { AddressComponent } from '../../shared/Address'
import { ScButton } from '../../shared/Button'
import { Datatable } from '../../shared/Datatable/Datatable'
import { ScMenu } from '../../shared/Menu'
import { SelectCompanyDialog } from '../../shared/SelectCompany/SelectCompanyDialog'
import { CompaniesRegisteredFilters } from './CompaniesRegisteredFilters'
import { EditAddressDialog } from './EditAddressDialog'
import { MassImport } from './MassImport'
import { IconBtnLink } from '../../alexlibs/mui-extension/IconBtnLink'

export const CompaniesRegistered = ({ search }: { search: CompanySearch }) => {
  const navigate = useNavigate()
  const { m, formatLargeNumber } = useI18n()
  const queryClient = useQueryClient()
  const { connectedUser, api: apiSdk } = useConnectedContext()
  const _companies = useActivatedCompanySearchQuery(search)

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
    navigate({ to: '.', search: _companies.filters, replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_companies.result.data?.entities, sortByResponseRate])

  // TRELLO-1391 The object _companies change all the time.
  // If we put it in dependencies, it causes problems with the debounce,
  // and the search input "stutters" when typing fast
  const onInputChange = useCallback((value: string) => {
    _companies.updateFilters((prev) => ({ ...prev, identity: value }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onEmailChange = useCallback((email: string) => {
    _companies.updateFilters((prev) => ({ ...prev, emailsWithAccess: email }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtersCount = useMemo(() => {
    const { offset, limit, ...filters } = _companies.filters
    return Object.keys(cleanObject(filters)).length
  }, [_companies.filters])

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
      <div className="mb-4">
        <p className="">
          Cette page liste toutes les sociétés qui existent dans SignalConso.{' '}
          Elles ont eu au moins un signalement, ou ont été ajoutées manuellement
          par un admin.
        </p>
        <p>
          Les chiffres (nombre de signalements, taux de réponse) ne sont pas en
          temps réel. Ils sont rafraichis toutes les heures.
        </p>
      </div>
      <CompaniesRegisteredFilters
        _companies={_companies}
        onSearchChange={onInputChange}
        onEmailChange={onEmailChange}
      />
      <Datatable
        id="companiesregistered"
        actions={
          <>
            <Badge
              color="error"
              badgeContent={filtersCount}
              hidden={filtersCount === 0}
            >
              <ScButton
                color="primary"
                variant="outlined"
                onClick={_companies.clearFilters}
                loading={_companies.result.isLoading}
              >
                {m.removeAllFilters}
              </ScButton>
            </Badge>
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
          </>
        }
        sort={{
          sortableColumns: ['responseRate'],
          sortBy: _companies.filters?.sortBy,
          orderBy: _companies.filters?.orderBy,
          onSortChange: ({ sortBy, orderBy }) =>
            _companies.updateFilters((prev) => ({
              ...prev,
              sortBy: sortBy,
              orderBy: orderBy,
            })),
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
                  <Link
                    to="/entreprise/$companyId/bilan"
                    params={{ companyId: _.id }}
                  >
                    <Txt link sx={{ marginBottom: '-1px' }}>
                      {_.name}
                    </Txt>
                  </Link>
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
                      color: (t) => t.palette.text.secondary,
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
                  sx={{ color: (t) => t.palette.text.secondary }}
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
              <Link
                to="/suivi-des-signalements"
                search={{
                  hasCompany: true,
                  siretSirenList: [_.siret],
                  departments: _companies.filters.departments,
                }}
                className="text-scbluefrance"
              >
                {formatLargeNumber(_.count)}
              </Link>
            ),
          },
          {
            head: <span>{m.responseRate}</span>,
            id: 'responseRate',
            sx: (_) => ({ textAlign: 'right' }),
            render: (_) => (
              <Box
                component="span"
                sx={{
                  fontWeight: (t) => t.typography.fontWeightBold,
                  ...(_.responseRate > 50
                    ? {
                        color: (t) => t.palette.success.main,
                      }
                    : _.responseRate === 0
                      ? {
                          color: (t) => t.palette.error.main,
                        }
                      : {
                          color: (t) => t.palette.warning.main,
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
                  <IconBtnLink
                    color="primary"
                    to="/entreprise/$companyId/bilan"
                    params={{ companyId: _.id }}
                    aria-label="Voir les statistiques de l'entreprise"
                  >
                    <Icon>query_stats</Icon>
                  </IconBtnLink>
                </Badge>
                <ScMenu>
                  <Link
                    to="/entreprise/$companyId/accesses"
                    params={{ companyId: _.id }}
                  >
                    <MenuItem>
                      <ListItemIcon>
                        <Icon>vpn_key</Icon>
                      </ListItemIcon>
                      <ListItemText>{m.handleAccesses}</ListItemText>
                    </MenuItem>
                  </Link>
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
