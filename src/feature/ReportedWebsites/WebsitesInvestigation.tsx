import React, {useCallback, useEffect, useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {Badge, Icon, InputBase, Switch, Tooltip} from '@mui/material'
import {useToast} from '../../core/toast'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {DebouncedInput} from '../../shared/DebouncedInput'
import {useReportedWebsiteWithCompanyContext} from '../../core/context/ReportedWebsitesContext'
import {IconBtn} from '../../alexlibs/mui-extension'
import {useWebsiteInvestigationContext} from '../../core/context/WebsiteInvestigationContext'
import {StatusChip} from './StatusChip'
import {WebsitesFilters} from './WebsitesFilters'
import {SelectWebsiteAssociation} from './SelectWebsiteIdentification/SelectWebsiteAssociation'
import {AutocompleteDialog} from '../../shared/AutocompleteDialog'
import {useEffectFn, useMap} from '../../alexlibs/react-hooks-lib'
import {WebsiteTools} from './WebsiteTools'
import {Txt} from '../../alexlibs/mui-extension'
import {sxUtils} from '../../core/theme'
import {useLogin} from '../../core/context/LoginContext'
import {
  IdentificationStatus,
  InvestigationStatus,
  WebsiteInvestigation,
  WebsiteWithCompany,
} from '../../core/client/website/Website'
import {cleanObject} from '../../core/helper'
import {Id} from '../../core/model'
import {PeriodPicker} from '../../shared/PeriodPicker'
import {SiretExtraction} from './SiretExtraction'
import {
  useListInvestigationStatusQuery,
  useWebsiteWithCompanySearchQuery,
  WebsiteWithCompanySearchKeys,
} from '../../core/queryhooks/websiteHooks'
import {useMutation, useQueryClient} from '@tanstack/react-query'

export const WebsitesInvestigation = () => {
  const {m, formatDate} = useI18n()
  const {connectedUser, apiSdk} = useLogin()
  const queryClient = useQueryClient()

  const _websiteWithCompany = useWebsiteWithCompanySearchQuery()
  const _investigationStatus = useListInvestigationStatusQuery()
  const _createOrUpdate = useMutation((websiteInvestigation: WebsiteInvestigation) =>
    apiSdk.secured.website.createOrUpdateInvestigation(websiteInvestigation),
  )
  const _updateStatus = useMutation(
    (params: {id: Id; identificationStatus: IdentificationStatus}) =>
      apiSdk.secured.website.updateStatus(params.id, params.identificationStatus),
    {
      onSuccess: _ => queryClient.invalidateQueries(WebsiteWithCompanySearchKeys),
    },
  )
  const _remove = useMutation((id: Id) => apiSdk.secured.website.remove(id), {
    onSuccess: _ => queryClient.invalidateQueries(WebsiteWithCompanySearchKeys).then(_ => toastSuccess(m.websiteDeleted)),
  })
  const {toastInfo, toastSuccess} = useToast()

  const websitesIndex = useMap<Id, WebsiteWithCompany>()

  useEffectFn(_websiteWithCompany.result.data, w => {
    websitesIndex.clear()
    w.entities.map(_ => websitesIndex.set(_.id, _))
  })

  // useEffect(() => {
  //   _websiteWithCompany.updateFilters({..._websiteWithCompany.initialFilters})
  // }, [])

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
                onChange={() => queryClient.invalidateQueries(WebsiteWithCompanySearchKeys)}
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
                identify={() => queryClient.invalidateQueries(WebsiteWithCompanySearchKeys)}
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
                    <IconBtn loading={_remove.isLoading} color="primary" onClick={() => onRemove(_.id)}>
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
  )
}
