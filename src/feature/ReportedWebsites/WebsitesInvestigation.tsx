import React, {useCallback, useEffect, useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {Badge, Icon, InputBase, Switch, Tooltip} from '@mui/material'
import {useToast} from '../../core/toast'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {useReportedWebsiteWithCompanyContext} from '../../core/context/ReportedWebsitesContext'
import {IconBtn} from '../../alexlibs/mui-extension'
import {useWebsiteInvestigationContext} from '../../core/context/WebsiteInvestigationContext'
import {StatusChip} from './StatusChip'
import {WebsitesFilters} from './WebsitesFilters'
import {SelectWebsiteAssociation} from './SelectWebsiteIdentification/SelectWebsiteAssociation'
import {AutocompleteDialog} from '../../shared/AutocompleteDialog/AutocompleteDialog'
import {useEffectFn, useMap} from '../../alexlibs/react-hooks-lib'
import {WebsiteTools} from './WebsiteTools'
import {Txt} from '../../alexlibs/mui-extension'
import {sxUtils} from '../../core/theme'
import {useLogin} from '../../core/context/LoginContext'
import {IdentificationStatus, InvestigationStatus, WebsiteWithCompany} from '../../core/client/website/Website'
import {cleanObject} from '../../core/helper'
import {Id} from '../../core/model'
import {PeriodPicker} from '../../shared/PeriodPicker/PeriodPicker'
import {SiretExtraction} from './SiretExtraction'

export const WebsitesInvestigation = () => {
  const {m, formatDate} = useI18n()
  const _websiteWithCompany = useReportedWebsiteWithCompanyContext().getWebsiteWithCompany
  const _createOrUpdate = useWebsiteInvestigationContext().createOrUpdateInvestigation
  const _investigationStatus = useWebsiteInvestigationContext().listInvestigationStatus
  const _updateStatus = useReportedWebsiteWithCompanyContext().update
  const _remove = useReportedWebsiteWithCompanyContext().remove
  const {toastError, toastInfo} = useToast()

  const {connectedUser} = useLogin()

  const websitesIndex = useMap<Id, WebsiteWithCompany>()

  useEffectFn(_websiteWithCompany.list, w => {
    websitesIndex.clear()
    w.entities.map(_ => websitesIndex.set(_.id, _))
  })

  useEffect(() => {
    _websiteWithCompany.fetch({clean: false})
  }, [_websiteWithCompany.filters])

  useEffect(() => {
    _websiteWithCompany.updateFilters({..._websiteWithCompany.initialFilters})
    _investigationStatus.fetch()
  }, [])

  useEffectFn(_updateStatus.error, toastError)
  useEffectFn(_websiteWithCompany.error, toastError)
  useEffectFn(_remove.error, toastError)

  const handleUpdateKind = (website: WebsiteWithCompany, identificationStatus: IdentificationStatus) => {
    _updateStatus.fetch({}, website.id, identificationStatus).then(_ => _websiteWithCompany.fetch({clean: false}))
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

  const onRemove = (id: string) => _remove.fetch({}, id).then(_ => _websiteWithCompany.fetch({clean: false}))

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
        loading={_websiteWithCompany.fetching}
        total={_websiteWithCompany.list?.totalCount}
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
                onChange={() => {
                  _websiteWithCompany.fetch({clean: false})
                }}
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
                identify={() => handleUpdateKind(_, IdentificationStatus.Identified)}
              />
            ),
          },
          {
            head: m.creationDate,
            id: 'creationDate',
            render: _ => formatDate(_.creationDate),
          },
          {
            head: m.lastUpdated,
            id: 'lastUpdated',
            render: _ => formatDate(_.lastUpdated),
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
                options={_investigationStatus.entity}
                onChange={investigationStatus => {
                  if (_.investigationStatus === investigationStatus) {
                    toastInfo(m.alreadySelectedValue(investigationStatus))
                  } else {
                    _createOrUpdate.fetch({}, {..._, investigationStatus})
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
                    <IconBtn loading={_remove.loading} color="primary" onClick={() => onRemove(_.id)}>
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
