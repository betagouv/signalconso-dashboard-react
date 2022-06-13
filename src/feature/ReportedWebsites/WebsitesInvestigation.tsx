import React, {useEffect, useMemo, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {
  Badge, Box,
  Icon,
  InputBase, ListItemIcon, ListItemText, MenuItem,
  Tooltip,
} from '@mui/material'
import {useToast} from '../../core/toast'
import {fromNullable} from 'fp-ts/lib/Option'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {useReportedWebsiteWithCompanyContext} from '../../core/context/ReportedWebsitesContext'
import {cleanObject, DepartmentDivision, WebsiteKind} from '@signal-conso/signalconso-api-sdk-js'
import {IconBtn} from 'mui-extension'

import {useWebsiteInvestigationContext} from '../../core/context/WebsiteInvestigationContext'
import {StatusChip} from './StatusChip'
import {WebsitesFilters} from "./WebsitesFilters";
import {WebsiteIdentification} from "./WebsiteIdentification";
import {WebsiteActions} from "./WebsiteActions";
import {SelectInvestigationAttributes} from "./SelectInvestigationAttributes";

export const WebsitesInvestigation = () => {
  const {m, formatDate} = useI18n()


  const fetch = useReportedWebsiteWithCompanyContext().getWebsiteWithCompany
  const _createOrUpdate = useWebsiteInvestigationContext().createOrUpdateInvestigation
  const _departmentDivision = useWebsiteInvestigationContext().listDepartmentDivision
  const _practice = useWebsiteInvestigationContext().listPractice
  const _investigationStatus = useWebsiteInvestigationContext().listInvestigationStatus
  const _updateStatus = useReportedWebsiteWithCompanyContext().update
  const _remove = useReportedWebsiteWithCompanyContext().remove
  const [departmentDivision, setDepartmentDivision] = useState<DepartmentDivision[]>([])
  const [investigationStatus, setInvestigationStatus] = useState<string[]>([])
  const [practice, setPractice] = useState<string[]>([])
  const {toastError, toastInfo, toastSuccess} = useToast()

  useEffect(() => {
    fetch.updateFilters({...fetch.initialFilters})
  }, [])

  useEffect(() => {
    fetch.fetch()
  }, [])

  useEffect(() => {
    _departmentDivision.fetch({}).then(setDepartmentDivision)
  }, [])

  useEffect(() => {
    _investigationStatus.fetch({}).then(setInvestigationStatus)
  }, [])

  useEffect(() => {
    _practice.fetch({}).then(setPractice)
  }, [])

  useEffect(() => {
    fromNullable(_updateStatus.error).map(toastError)
    fromNullable(fetch.error).map(toastError)
    fromNullable(_remove.error).map(toastError)
  }, [_updateStatus.error, fetch.error, _remove.error])

  const filtersCount = useMemo(() => {
    const {offset, limit, ...filters} = fetch.filters
    return Object.keys(cleanObject(filters)).length
  }, [fetch.filters])



  return (
    <Panel>
      <Datatable
        id="reportcompanieswebsites"
        header={
          <>
            <DebouncedInput
              value={fetch.filters.host ?? ''}
              onChange={host => fetch.updateFilters(prev => ({...prev, host: host}))}
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
          </>
        }
        actions={
          <>
            <Tooltip title={m.removeAllFilters}>
              <Badge color="error" badgeContent={filtersCount} hidden={filtersCount === 0} overlap="circular">
              <IconBtn color="primary" onClick={fetch.clearFilters}>
                <Icon>clear</Icon>
              </IconBtn>
              </Badge>
            </Tooltip>
            <WebsitesFilters
              filters={fetch.filters}
              updateFilters={_ => {
                fetch.updateFilters(prev => ({...prev, ..._}))
              }}>
              <Tooltip title={m.advancedFilters}>
                <IconBtn color="primary">
                  <Icon>filter_list</Icon>
                </IconBtn>
              </Tooltip>
            </WebsitesFilters>
          </>
        }
        loading={fetch.fetching}
        total={fetch.list?.totalSize}
        paginate={{
          limit: fetch.filters.limit,
          offset: fetch.filters.offset,
          onPaginationChange: pagination => fetch.updateFilters(prev => ({...prev, ...pagination})),
        }}
        getRenderRowKey={_ => _.id}
        data={fetch.list?.data}
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
            head: m.identication,
            id: 'identication',
            render: _ => (
              <WebsiteIdentification
                website={_}
                onChangeDone={() => fetch.fetch({clean: false})}
              />
            ),
          },
          {
            head: m.practice,
            id: 'practice',
            render: _ => (
              <SelectInvestigationAttributes<string>
                title={m.practiceTitle}
                inputLabel={m.practice}
                getValueName={_ => _}
                onChange={practice => {
                  if (_.practice === practice) {
                    toastInfo(m.alreadySelectedValue(practice))
                  } else {
                    _createOrUpdate
                      .fetch(
                        {},
                        {
                          practice: practice,
                          ..._,
                        },
                      )
                      .then(_ => fetch.fetch({clean: false}))
                  }
                }}
                listValues={practice}
              >
                <StatusChip tooltipTitle={m.practice} value={_.practice ?? m.noValue}/>
              </SelectInvestigationAttributes>
            ),
          },
          {
            head: m.investigation,
            id: 'investigationStatus',
            render: _ => (
              <SelectInvestigationAttributes<string>
                title={m.affectationTitle}
                inputLabel={m.affectation}
                getValueName={_ => m.investigationStatus(_)}
                onChange={investigationStatus => {
                  if (_.investigationStatus === investigationStatus) {
                    toastInfo(m.alreadySelectedValue(investigationStatus))
                  } else {
                    console.log(investigationStatus)
                    _createOrUpdate
                      .fetch(
                        {},
                        Object.assign({..._},{
                          investigationStatus: investigationStatus,
                        },
                      ))
                      .then(_ => fetch.fetch({clean: false}))
                  }
                }}
                listValues={investigationStatus}
              >
                <StatusChip tooltipTitle={m.investigation} value={_.investigationStatus ? m.investigationStatus(_.investigationStatus) : m.noValue}/>
              </SelectInvestigationAttributes>
            ),
          },
          {
            head: m.affectation,
            id: 'affectation',
            render: _ => (
              <SelectInvestigationAttributes<DepartmentDivision>
                title={m.affectationTitle}
                inputLabel={m.affectation}
                getValueName={_ => _.code +" - " + _.name}
                onChange={departmentDivision => {
                  if (departmentDivision && _.attribution === departmentDivision.code) {
                    toastInfo(m.alreadySelectedValue(departmentDivision?.name))
                  } else {
                    console.log(departmentDivision)
                    _createOrUpdate
                      .fetch(
                        {},
                        Object.assign({..._},{
                          attribution: departmentDivision && departmentDivision.code,
                          },
                        ))
                      .then(_ => fetch.fetch({clean: false}))
                  }
                }}
                listValues={departmentDivision}
              >
                <StatusChip tooltipTitle={m.affectation} value={_.attribution ?? m.noValue}/>
              </SelectInvestigationAttributes>
            ),
          },
          {
            id: 'status',
            stickyEnd: true,
            render: _ =>
                <WebsiteActions
                  website={_}
                  refreshData={() => fetch.fetch({clean: false})}
                />
            ,
          }
        ]}
      />
    </Panel>
  )
}
