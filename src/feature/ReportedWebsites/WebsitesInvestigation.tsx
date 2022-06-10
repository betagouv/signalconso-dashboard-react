import React, {useEffect, useState} from 'react'
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
import {DepartmentDivision, WebsiteKind} from '@signal-conso/signalconso-api-sdk-js'
import {IconBtn} from 'mui-extension'

import {useWebsiteInvestigationContext} from '../../core/context/WebsiteInvestigationContext'
import {StatusChip} from './StatusChip'
import {SelectXXXX} from './SelectXXXX'
import {WebsitesFilters} from "./WebsitesFilters";
import {WebsiteIdentification} from "./WebsiteIdentification";
import {WebsiteActions} from "./WebsiteActions";

export const WebsitesInvestigation = () => {
  const {m, formatDate} = useI18n()


  const _websiteInvestigation = useWebsiteInvestigationContext().getWebsiteInvestigation
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
    _websiteInvestigation.updateFilters({..._websiteInvestigation.initialFilters})
  }, [])

  useEffect(() => {
    _websiteInvestigation.fetch()
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
    fromNullable(_websiteInvestigation.error).map(toastError)
    fromNullable(_remove.error).map(toastError)
  }, [_updateStatus.error, _websiteInvestigation.error, _remove.error])



  return (
    <Panel>
      <Datatable
        id="reportcompanieswebsites"
        header={
          <>
            <DebouncedInput
              value={_websiteInvestigation.filters.host ?? ''}
              onChange={host => _websiteInvestigation.updateFilters(prev => ({...prev, host: host}))}
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
              <IconBtn color="primary" onClick={_websiteInvestigation.clearFilters}>
                <Icon>clear</Icon>
              </IconBtn>
            </Tooltip>
            <WebsitesFilters
              filters={_websiteInvestigation.filters}
              updateFilters={_ => {
                _websiteInvestigation.updateFilters(prev => ({...prev, ..._}))
              }}>
              <Tooltip title={m.advancedFilters}>
                <IconBtn color="primary">
                  <Icon>filter_list</Icon>
                </IconBtn>
              </Tooltip>
            </WebsitesFilters>
          </>
        }
        loading={_websiteInvestigation.fetching}
        total={_websiteInvestigation.list?.totalSize}
        paginate={{
          limit: _websiteInvestigation.filters.limit,
          offset: _websiteInvestigation.filters.offset,
          onPaginationChange: pagination => _websiteInvestigation.updateFilters(prev => ({...prev, ...pagination})),
        }}
        getRenderRowKey={_ => _.id}
        data={_websiteInvestigation.list?.data}
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
                onChangeDone={() => _websiteInvestigation.fetch({clean: false})}
              />
            ),
          },
          {
            head: m.practice,
            id: 'practice',
            render: _ => (
              <SelectXXXX<string>
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
                      .then(_ => _websiteInvestigation.fetch({clean: false}))
                  }
                }}
                listValues={practice}
              >
                <StatusChip tooltipTitle={m.practice} value={_.practice ?? m.noValue}/>
              </SelectXXXX>
            ),
          },
          {
            head: m.investigation,
            id: 'investigationStatus',
            render: _ => (
              <SelectXXXX<string>
                title={m.affectationTitle}
                inputLabel={m.affectation}
                getValueName={_ => _}
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
                      .then(_ => _websiteInvestigation.fetch({clean: false}))
                  }
                }}
                listValues={investigationStatus}
              >
                <StatusChip tooltipTitle={m.investigation} value={_.investigationStatus ?? m.noValue}/>
              </SelectXXXX>
            ),
          },
          {
            head: m.affectation,
            id: 'affectation',
            render: _ => (
              <SelectXXXX<DepartmentDivision>
                title={m.affectationTitle}
                inputLabel={m.affectation}
                getValueName={_ => _.name}
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
                      .then(_ => _websiteInvestigation.fetch({clean: false}))
                  }
                }}
                listValues={departmentDivision}
              >
                <StatusChip tooltipTitle={m.affectation} value={_.attribution ?? m.noValue}/>
              </SelectXXXX>
            ),
          },
          {
            id: 'status',
            stickyEnd: true,
            render: _ =>
                <WebsiteActions
                  website={_}
                  refreshData={() => _websiteInvestigation.fetch({clean: false})}
                />
            ,
          }
        ]}
      />
    </Panel>
  )
}
