import React, {useCallback, useMemo, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {Badge, Box, Icon, InputBase, Switch, Tooltip} from '@mui/material'
import {Alert} from '../../alexlibs/mui-extension'
import {useToast} from '../../core/toast'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {DebouncedInput} from '../../shared/DebouncedInput'
import {Btn, IconBtn, Txt} from '../../alexlibs/mui-extension'
import {StatusChip} from './StatusChip'
import {WebsitesFilters} from './WebsitesFilters'
import {SelectWebsiteAssociation} from './SelectWebsiteIdentification/SelectWebsiteAssociation'
import {AutocompleteDialog} from '../../shared/AutocompleteDialog'
import {WebsiteTools} from './WebsiteTools'
import {sxUtils} from '../../core/theme'
import {useLogin} from '../../core/context/LoginContext'
import {IdentificationStatus, InvestigationStatus, WebsiteWithCompany} from '../../core/client/website/Website'
import {cleanObject} from '../../core/helper'
import {Id} from '../../core/model'
import {PeriodPicker} from '../../shared/PeriodPicker'
import {SiretExtraction} from './SiretExtraction'
import {
  useListInvestigationStatusQuery,
  useWebsiteWithClosedCompanyQuery,
  useWebsiteWithCompanySearchQuery,
  WebsiteWithCompanySearchKeys,
} from '../../core/queryhooks/websiteQueryHooks'
import {useMutation, useQueryClient} from '@tanstack/react-query'

export const WebsitesInvestigation = () => {
  const {m, formatDate} = useI18n()
  const {connectedUser, apiSdk} = useLogin()
  const queryClient = useQueryClient()

  const _websiteWithCompany = useWebsiteWithCompanySearchQuery()
  const _websiteWithClosedCompany = useWebsiteWithClosedCompanyQuery()

  const _investigationStatus = useListInvestigationStatusQuery()
  const _createOrUpdate = useMutation({
    mutationFn: apiSdk.secured.website.createOrUpdateInvestigation,
    onSuccess: () => queryClient.invalidateQueries({queryKey: WebsiteWithCompanySearchKeys}),
  })
  const _updateStatus = useMutation({
    mutationFn: (params: {id: Id; identificationStatus: IdentificationStatus}) =>
      apiSdk.secured.website.updateStatus(params.id, params.identificationStatus),
    onSuccess: () => queryClient.invalidateQueries({queryKey: WebsiteWithCompanySearchKeys}),
  })
  const _remove = useMutation({
    mutationFn: apiSdk.secured.website.remove,
    onSuccess: () => {
      toastSuccess(m.websiteDeleted)
      return queryClient.invalidateQueries({queryKey: WebsiteWithCompanySearchKeys})
    },
  })
  const {toastInfo, toastSuccess} = useToast()

<<<<<<< Updated upstream
=======
  const websitesIndex = useMap<Id, WebsiteWithCompany>()

  const [assocationWithClosedCompaniesCount, setAssocationWithClosedCompaniesCount] = useState<number | undefined>(undefined)

  useEffectFn(_websiteWithCompany.result.data, w => {
    websitesIndex.clear()
    w.entities.map(_ => websitesIndex.set(_.id, _))
  })

  useEffectFn(_websiteWithClosedCompany.result.data, w => {
    setAssocationWithClosedCompaniesCount(w.totalCount)
  })

  const handleSeeClosedCompanyAssociation = () => {
    _websiteWithCompany.clearFilters()
    _websiteWithCompany.updateFilters(prev => ({
      ...prev,
      ...{
        isOpen: false,
        identificationStatus: [IdentificationStatus.Identified],
      },
    }))
  }

>>>>>>> Stashed changes
  const handleUpdateKind = (website: WebsiteWithCompany, identificationStatus: IdentificationStatus) => {
    _updateStatus.mutate({id: website.id, identificationStatus})
  }

  const filtersCount = useMemo(() => {
    const {offset, limit, ...filters} = _websiteWithCompany.filters
    return Object.keys(cleanObject(filters)).length
  }, [_websiteWithCompany.filters])

  const onHostChange = useCallback((host: string) => {
    _websiteWithCompany.updateFilters(prev => ({...prev, host: host}))
    // TRELLO-1391 The object _websiteWithCompany change all the time.
    // If we put it in dependencies, it causes problems with the debounce,
    // and the search input "stutters" when typing fast
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onRemove = (id: string) => _remove.mutateAsync(id)

  return (
    <>
      <Box sx={{p: 1, mb: 2}}>
        {assocationWithClosedCompaniesCount && (
          <Alert dense type={'error'}>
            {m.websiteInvestigationClosedCompanyAssociationDesc}
            <div className="flex justify-end">
              <Btn size="medium" onClick={_ => handleSeeClosedCompanyAssociation()}>
                VOIR
              </Btn>
            </div>
          </Alert>
        )}
      </Box>

<<<<<<< Updated upstream
            <DebouncedInput<[Date | undefined, Date | undefined]>
              value={[_websiteWithCompany.filters.start, _websiteWithCompany.filters.end]}
              onChange={([start, end]) => {
                _websiteWithCompany.updateFilters(prev => ({...prev, start, end}))
              }}
            >
              {(value, onChange) => <PeriodPicker value={value} onChange={onChange} sx={{mr: 1}} fullWidth />}
            </DebouncedInput>
          </>
        }
        actions={
          <>
            <Tooltip title={m.removeAllFilters}>
              <Badge color="error" badgeContent={filtersCount} hidden={filtersCount === 0} overlap="circular">
                <IconBtn color="primary" onClick={_websiteWithCompany.clearFilters}>
                  <Icon>clear</Icon>
                </IconBtn>
              </Badge>
            </Tooltip>
            <WebsitesFilters
              filters={_websiteWithCompany.filters}
              updateFilters={_ => {
                _websiteWithCompany.updateFilters(prev => ({...prev, ..._}))
              }}
            >
              <Tooltip title={m.advancedFilters}>
                <IconBtn color="primary">
                  <Icon>filter_list</Icon>
                </IconBtn>
              </Tooltip>
            </WebsitesFilters>
          </>
        }
        loading={_websiteWithCompany.result.isFetching}
        total={_websiteWithCompany.result.data?.totalCount}
        paginate={{
          limit: _websiteWithCompany.filters.limit,
          offset: _websiteWithCompany.filters.offset,
          onPaginationChange: pagination => _websiteWithCompany.updateFilters(prev => ({...prev, ...pagination})),
        }}
        getRenderRowKey={_ => _.id}
        data={_websiteWithCompany.result.data?.entities}
        showColumnsToggle={true}
        columns={[
          {
            id: 'host',
            head: m.website,
            render: _ => (
              <Txt link>
                <a href={'https://' + _.host}>{_.host}</a>
              </Txt>
            ),
          },
          {
            head: m.reports,
            id: 'reports',
            render: _ => _.count,
          },
          {
            head: m.association,
            id: 'association',
            render: _ => (
              <SelectWebsiteAssociation
                website={_}
                onChange={() => queryClient.invalidateQueries({queryKey: WebsiteWithCompanySearchKeys})}
              />
            ),
          },
          {
            head: 'Recherche de Siret',
            id: 'extraction',
            render: _ => (
              <SiretExtraction
                websiteWithCompany={_}
                remove={() => onRemove(_.id)}
                identify={() => queryClient.invalidateQueries({queryKey: WebsiteWithCompanySearchKeys})}
              />
            ),
          },
          {
            head: m.firstReportDate,
            id: 'firstReportDate',
            render: _ => formatDate(_.creationDate),
          },
          {
            head: m.investigation,
            id: 'investigationStatus',
            render: _ => (
              <AutocompleteDialog<InvestigationStatus>
                value={_.investigationStatus}
                title={m.investigation}
                inputLabel={m.investigation}
                getOptionLabel={_ => m.InvestigationStatusDesc[_]}
                options={_investigationStatus.data}
                onChange={investigationStatus => {
                  if (_.investigationStatus === investigationStatus) {
                    toastInfo(m.alreadySelectedValue(investigationStatus))
                  } else {
                    _createOrUpdate.mutate({..._, investigationStatus})
                  }
=======
      <Panel>
        <Datatable
          id="reportcompanieswebsites"
          header={
            <>
              <DebouncedInput value={_websiteWithCompany.filters.host ?? ''} onChange={onHostChange}>
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

              <DebouncedInput<[Date | undefined, Date | undefined]>
                value={[_websiteWithCompany.filters.start, _websiteWithCompany.filters.end]}
                onChange={([start, end]) => {
                  _websiteWithCompany.updateFilters(prev => ({...prev, start, end}))
>>>>>>> Stashed changes
                }}
              >
                {(value, onChange) => <PeriodPicker value={value} onChange={onChange} sx={{mr: 1}} fullWidth />}
              </DebouncedInput>
            </>
          }
          actions={
            <>
              <Tooltip title={m.removeAllFilters}>
                <Badge color="error" badgeContent={filtersCount} hidden={filtersCount === 0} overlap="circular">
                  <IconBtn color="primary" onClick={_websiteWithCompany.clearFilters}>
                    <Icon>clear</Icon>
                  </IconBtn>
                </Badge>
              </Tooltip>
              <WebsitesFilters
                filters={_websiteWithCompany.filters}
                updateFilters={_ => {
                  _websiteWithCompany.updateFilters(prev => ({...prev, ..._}))
                }}
              >
                <Tooltip title={m.advancedFilters}>
                  <IconBtn color="primary">
                    <Icon>filter_list</Icon>
                  </IconBtn>
                </Tooltip>
              </WebsitesFilters>
            </>
          }
          loading={_websiteWithCompany.result.isFetching}
          total={_websiteWithCompany.result.data?.totalCount}
          paginate={{
            limit: _websiteWithCompany.filters.limit,
            offset: _websiteWithCompany.filters.offset,
            onPaginationChange: pagination => _websiteWithCompany.updateFilters(prev => ({...prev, ...pagination})),
          }}
          getRenderRowKey={_ => _.id}
          data={websitesIndex.values()}
          showColumnsToggle={true}
          columns={[
            {
              id: 'host',
              head: m.website,
              render: _ => (
                <Txt link>
                  <a href={'https://' + _.host}>{_.host}</a>
                </Txt>
              ),
            },
            {
              head: m.reports,
              id: 'reports',
              render: _ => _.count,
            },
            {
              head: m.association,
              id: 'association',
              render: _ => (
                <SelectWebsiteAssociation
                  website={_}
                  onChange={() => queryClient.invalidateQueries({queryKey: WebsiteWithCompanySearchKeys})}
                />
              ),
            },
            {
              head: 'Recherche de Siret',
              id: 'extraction',
              render: _ => (
                <SiretExtraction
                  websiteWithCompany={_}
                  remove={() => onRemove(_.id)}
                  identify={() => queryClient.invalidateQueries({queryKey: WebsiteWithCompanySearchKeys})}
                />
              ),
            },
            {
              head: m.firstReportDate,
              id: 'firstReportDate',
              render: _ => formatDate(_.creationDate),
            },
            {
              head: m.investigation,
              id: 'investigationStatus',
              render: _ => (
                <AutocompleteDialog<InvestigationStatus>
                  value={_.investigationStatus}
                  title={m.investigation}
                  inputLabel={m.investigation}
                  getOptionLabel={_ => m.InvestigationStatusDesc[_]}
                  options={_investigationStatus.data}
                  onChange={investigationStatus => {
                    if (_.investigationStatus === investigationStatus) {
                      toastInfo(m.alreadySelectedValue(investigationStatus))
                    } else {
                      _createOrUpdate.mutate({..._, investigationStatus})
                      websitesIndex.set(_.id, {..._, lastUpdated: new Date(Date.now()), investigationStatus})
                    }
                  }}
                >
                  <StatusChip
                    tooltipTitle={m.investigation}
                    value={_.investigationStatus ? m.InvestigationStatusDesc[_.investigationStatus] : m.noValue}
                  />
                </AutocompleteDialog>
              ),
            },
            {
              id: 'status',
              stickyEnd: true,
              head: m.identified,
              render: _ => (
                <Switch
                  checked={_.identificationStatus === IdentificationStatus.Identified}
                  onChange={e =>
                    handleUpdateKind(_, e.target.checked ? IdentificationStatus.Identified : IdentificationStatus.NotIdentified)
                  }
                />
              ),
            },

            {
              id: 'action',
              stickyEnd: true,
              sx: _ => sxUtils.tdActions,
              render: _ => (
                <>
                  <WebsiteTools website={_} />
                  {connectedUser.isAdmin ? (
                    <Tooltip title={m.delete}>
                      <IconBtn loading={_remove.isPending} color="primary" onClick={() => onRemove(_.id)}>
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
      </Panel>
    </>
  )
}
