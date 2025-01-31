import { Badge, Box, Icon, Switch, Tooltip } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { Alert, Btn, IconBtn, Txt } from '../../alexlibs/mui-extension'
import { useEffectFn } from '../../alexlibs/react-hooks-lib'
import {
  IdentificationStatus,
  InvestigationStatus,
  WebsiteWithCompany,
} from '../../core/client/website/Website'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { useToast } from '../../core/context/toastContext'
import { cleanObject } from '../../core/helper'
import { useI18n } from '../../core/i18n'
import { Id } from '../../core/model'
import {
  useListInvestigationStatusQuery,
  useWebsiteWithClosedCompanyQuery,
  useWebsiteWithCompanySearchQuery,
  WebsiteWithCompanySearchKeys,
} from '../../core/queryhooks/websiteQueryHooks'
import { sxUtils } from '../../core/theme'
import { AutocompleteDialog } from '../../shared/AutocompleteDialog'
import { Datatable } from '../../shared/Datatable/Datatable'
import { AddSiret } from './AddSiret'
import { SelectWebsiteAssociation } from './SelectWebsiteIdentification/SelectWebsiteAssociation'
import { SiretExtraction } from './SiretExtraction'
import { StatusChip } from './StatusChip'
import { WebsitesFilters } from './WebsitesFilters'
import { WebsiteTools } from './WebsiteTools'
import { ScButton } from '../../shared/Button'

export const WebsitesInvestigation = () => {
  const { m, formatDate } = useI18n()
  const { connectedUser, api: apiSdk } = useConnectedContext()
  const queryClient = useQueryClient()

  const _websiteWithCompany = useWebsiteWithCompanySearchQuery()
  const _websiteWithClosedCompany = useWebsiteWithClosedCompanyQuery()

  const _investigationStatus = useListInvestigationStatusQuery()
  const _createOrUpdate = useMutation({
    mutationFn: apiSdk.secured.website.createOrUpdateInvestigation,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: WebsiteWithCompanySearchKeys }),
  })
  const _updateStatus = useMutation({
    mutationFn: (params: {
      id: Id
      identificationStatus: IdentificationStatus
    }) =>
      apiSdk.secured.website.updateStatus(
        params.id,
        params.identificationStatus,
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: WebsiteWithCompanySearchKeys }),
  })
  const _remove = useMutation({
    mutationFn: apiSdk.secured.website.remove,
    onSuccess: () => {
      toastSuccess(m.websiteDeleted)
      return queryClient.invalidateQueries({
        queryKey: WebsiteWithCompanySearchKeys,
      })
    },
  })
  const { toastInfo, toastSuccess } = useToast()

  const handleUpdateKind = (
    website: WebsiteWithCompany,
    identificationStatus: IdentificationStatus,
  ) => {
    _updateStatus.mutate({ id: website.id, identificationStatus })
  }

  const _updateMarketplace = useMutation({
    mutationFn: (params: { id: Id; isMarketplace: boolean }) =>
      apiSdk.secured.website.updateMarketplace(params.id, params.isMarketplace),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: WebsiteWithCompanySearchKeys }),
  })

  const filtersCount = useMemo(() => {
    const { offset, limit, ...filters } = _websiteWithCompany.filters
    return Object.keys(cleanObject(filters)).length
  }, [_websiteWithCompany.filters])

  const onHostChange = useCallback((host: string) => {
    _websiteWithCompany.updateFilters((prev) => ({ ...prev, host: host }))
    // TRELLO-1391 The object _websiteWithCompany change all the time.
    // If we put it in dependencies, it causes problems with the debounce,
    // and the search input "stutters" when typing fast
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [
    assocationWithClosedCompaniesCount,
    setAssocationWithClosedCompaniesCount,
  ] = useState<number | undefined>(undefined)

  useEffectFn(_websiteWithClosedCompany.result.data, (w) => {
    setAssocationWithClosedCompaniesCount(w.totalCount)
  })

  const handleSeeClosedCompanyAssociation = () => {
    _websiteWithCompany.clearFilters()
    _websiteWithCompany.updateFilters((prev) => ({
      ...prev,
      ...{
        isOpen: false,
        identificationStatus: [IdentificationStatus.Identified],
        investigationStatus: [
          InvestigationStatus.Processing,
          InvestigationStatus.NotProcessed,
        ],
      },
    }))
  }

  const onRemove = (id: string) => _remove.mutateAsync(id)

  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        <Explanation />
        {assocationWithClosedCompaniesCount && (
          <Alert dense type={'error'}>
            {m.websiteInvestigationClosedCompanyAssociationDesc}
            <div className="flex justify-end">
              <Btn
                size="medium"
                onClick={(_) => handleSeeClosedCompanyAssociation()}
              >
                VOIR
              </Btn>
            </div>
          </Alert>
        )}
      </div>
      <WebsitesFilters
        _websiteWithCompany={_websiteWithCompany}
        onHostChange={onHostChange}
      />
      <Datatable
        id="reportcompanieswebsites"
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
                onClick={_websiteWithCompany.clearFilters}
              >
                {m.removeAllFilters}
              </ScButton>
            </Badge>
            {connectedUser.isAdmin && (
              <AddSiret>
                <ScButton color="primary" variant="outlined">
                  {m.createWebsite}
                </ScButton>
              </AddSiret>
            )}
          </>
        }
        loading={_websiteWithCompany.result.isFetching}
        total={_websiteWithCompany.result.data?.totalCount}
        paginate={{
          limit: _websiteWithCompany.filters.limit,
          offset: _websiteWithCompany.filters.offset,
          onPaginationChange: (pagination) =>
            _websiteWithCompany.updateFilters((prev) => ({
              ...prev,
              ...pagination,
            })),
        }}
        getRenderRowKey={(_) => _.id}
        data={_websiteWithCompany.result.data?.entities}
        showColumnsToggle={true}
        columns={[
          {
            id: 'host',
            head: m.website,
            render: (_) => (
              <div className="flex flex-col">
                <Txt link>
                  <a href={'https://' + _.host}>{_.host}</a>
                </Txt>
                {_.isMarketplace ? (
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <Icon>store_front</Icon>
                    <Txt italic>marketplace</Txt>
                  </Box>
                ) : null}
              </div>
            ),
          },
          {
            head: m.reports,
            id: 'reports',
            render: (_) => _.count,
          },
          {
            head: m.association,
            id: 'association',
            render: (_) => (
              <SelectWebsiteAssociation
                website={_}
                onChange={() =>
                  queryClient.invalidateQueries({
                    queryKey: WebsiteWithCompanySearchKeys,
                  })
                }
              />
            ),
          },
          {
            head: 'Extraction de Siret',
            id: 'extraction',
            render: (_) =>
              _.siretExtraction ? (
                <SiretExtraction
                  websiteWithCompany={_}
                  siretExtraction={_.siretExtraction}
                  isLoading={false}
                  remove={() => onRemove(_.id)}
                  identify={() =>
                    queryClient.invalidateQueries({
                      queryKey: WebsiteWithCompanySearchKeys,
                    })
                  }
                >
                  <IconBtn>
                    <Icon
                      color={
                        _.siretExtraction?.extractions
                          ? _.siretExtraction.extractions.length > 0
                            ? 'success'
                            : 'warning'
                          : 'error'
                      }
                    >
                      search
                    </Icon>
                  </IconBtn>
                </SiretExtraction>
              ) : undefined,
          },
          {
            head: m.firstReportDate,
            id: 'firstReportDate',
            render: (_) => formatDate(_.creationDate),
          },
          {
            head: m.investigation,
            id: 'investigationStatus',
            render: (_) => (
              <AutocompleteDialog<InvestigationStatus>
                value={_.investigationStatus}
                title={m.investigation}
                inputLabel={m.investigation}
                getOptionLabel={(_) => m.InvestigationStatusDesc[_]}
                options={_investigationStatus.data}
                onChange={(investigationStatus) => {
                  if (_.investigationStatus === investigationStatus) {
                    toastInfo(m.alreadySelectedValue(investigationStatus))
                  } else {
                    _createOrUpdate.mutate({ ..._, investigationStatus })
                  }
                }}
              >
                <StatusChip
                  tooltipTitle={m.investigation}
                  value={
                    _.investigationStatus
                      ? m.InvestigationStatusDesc[_.investigationStatus]
                      : m.noValue
                  }
                />
              </AutocompleteDialog>
            ),
          },
          {
            id: 'status',
            stickyEnd: true,
            head: m.identified,
            render: (_) => (
              <Switch
                checked={
                  _.identificationStatus === IdentificationStatus.Identified
                }
                onChange={(e) =>
                  handleUpdateKind(
                    _,
                    e.target.checked
                      ? IdentificationStatus.Identified
                      : IdentificationStatus.NotIdentified,
                  )
                }
              />
            ),
          },
          {
            id: 'marketplace',
            stickyEnd: true,
            head: 'Marketplace',
            render: (_) => (
              <Switch
                checked={_.isMarketplace}
                onChange={(e) =>
                  _updateMarketplace.mutate({
                    id: _.id,
                    isMarketplace: e.target.checked,
                  })
                }
              />
            ),
          },
          {
            id: 'action',
            stickyEnd: true,
            sx: (_) => sxUtils.tdActions,
            render: (_) => (
              <>
                <WebsiteTools website={_} onRemove={onRemove} />
                {connectedUser.isAdmin ? (
                  <Tooltip title={m.delete}>
                    <IconBtn
                      loading={_remove.isPending}
                      color="primary"
                      onClick={() => onRemove(_.id)}
                    >
                      <Icon>delete</Icon>
                    </IconBtn>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </>
            ),
          },
        ]}
      />
    </>
  )
}

function Explanation() {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <div
        className="hover:bg-gray-100 cursor-pointer"
        onClick={() => setExpanded((_) => !_)}
      >
        Cette page permet de gérer les associations des sites web aux
        entreprises{' '}
        {expanded || (
          <span className="text-scbluefrance">
            ({`cliquez pour plus d'explications`})
          </span>
        )}
      </div>
      {expanded && (
        <div className="my-2">
          <Alert type="info" deletable>
            <ul>
              <li>
                Cette page liste tous les sites qui ont été signalés. Ces sites
                ont pu être associés à une entreprise, un pays, ou à rien du
                tout.
              </li>
              <li>
                Il y a une ligne par association (un site web peut donc
                apparaitre plusieurs fois).
              </li>
              <li>
                Ces associations sont celles suggérés par les consommateurs (ou
                éventuellement ajoutées directement par un admin).
              </li>
              <li>
                Les admins peuvent marquer ces associations comme "identifiées",
                celles-ci seront ensuite utilisées pour proposer aux
                consommateurs l'identité de l'entreprise lors des futurs
                signalements.
              </li>
              <li className="mt-4">
                Attention,{' '}
                <span className="font-bold">
                  il y a un filtre par défaut sur cette page
                </span>
                , on n'affiche que les associations qui ne sont pas encore
                marquées comme "identifiées".
              </li>
            </ul>
          </Alert>
        </div>
      )}
    </>
  )
}
