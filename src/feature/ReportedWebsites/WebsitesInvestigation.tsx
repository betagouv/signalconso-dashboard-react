import React, {useEffect, useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {Badge, Icon, InputBase, Switch, Tooltip} from '@mui/material'
import {useToast} from '../../core/toast'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {useReportedWebsiteWithCompanyContext} from '../../core/context/ReportedWebsitesContext'
import {cleanObject, DepartmentDivision, WebsiteKind, WebsiteWithCompany} from '@signal-conso/signalconso-api-sdk-js'
import {IconBtn} from 'mui-extension'
import {useWebsiteInvestigationContext} from '../../core/context/WebsiteInvestigationContext'
import {StatusChip} from './StatusChip'
import {WebsitesFilters} from './WebsitesFilters'
import {WebsiteIdentification} from './WebsiteIdentification'
import {SelectInvestigationAttributes} from './SelectInvestigationAttributes'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {WebsiteTools} from './WebsiteTools'

export const WebsitesInvestigation = () => {
  const {m} = useI18n()
  const _websiteWithCompany = useReportedWebsiteWithCompanyContext().getWebsiteWithCompany
  const _createOrUpdate = useWebsiteInvestigationContext().createOrUpdateInvestigation
  const _departmentDivision = useWebsiteInvestigationContext().listDepartmentDivision
  const _practice = useWebsiteInvestigationContext().listPractice
  const _investigationStatus = useWebsiteInvestigationContext().listInvestigationStatus
  const _updateStatus = useReportedWebsiteWithCompanyContext().update
  const _remove = useReportedWebsiteWithCompanyContext().remove
  const {toastError, toastInfo} = useToast()

  useEffect(() => {
    _websiteWithCompany.fetch({clean: false})
  }, [_websiteWithCompany.filters])

  useEffect(() => {
    _websiteWithCompany.updateFilters({..._websiteWithCompany.initialFilters})
    _departmentDivision.fetch()
    _investigationStatus.fetch()
    _practice.fetch()
  }, [])

  useEffectFn(_updateStatus.error, toastError)
  useEffectFn(_websiteWithCompany.error, toastError)
  useEffectFn(_remove.error, toastError)

  const handleUpdateKind = (website: WebsiteWithCompany, kind: WebsiteKind) => {
    _updateStatus.fetch({}, website.id, kind).then(() => _websiteWithCompany.fetch({clean: false}))
  }

  const filtersCount = useMemo(() => {
    const {offset, limit, ...filters} = _websiteWithCompany.filters
    return Object.keys(cleanObject(filters)).length
  }, [_websiteWithCompany.filters])

  return (
    <Panel>
      <Datatable
        id="reportcompanieswebsites"
        header={
          <>
            <DebouncedInput
              value={_websiteWithCompany.filters.host ?? ''}
              onChange={host => _websiteWithCompany.updateFilters(prev => ({...prev, host: host}))}
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
                <IconBtn color="primary" onClick={_websiteWithCompany.clearFilters}>
                  <Icon>clear</Icon>
                </IconBtn>
              </Badge>
            </Tooltip>
            <WebsitesFilters
              filters={_websiteWithCompany.filters}
              updateFilters={_ => {
                _websiteWithCompany.updateFilters(prev => ({...prev, ..._}))
              }}>
              <Tooltip title={m.advancedFilters}>
                <IconBtn color="primary">
                  <Icon>filter_list</Icon>
                </IconBtn>
              </Tooltip>
            </WebsitesFilters>
          </>
        }
        loading={_websiteWithCompany.fetching}
        total={_websiteWithCompany.list?.totalSize}
        paginate={{
          limit: _websiteWithCompany.filters.limit,
          offset: _websiteWithCompany.filters.offset,
          onPaginationChange: pagination => _websiteWithCompany.updateFilters(prev => ({...prev, ...pagination})),
        }}
        getRenderRowKey={_ => _.id}
        data={_websiteWithCompany.list?.data}
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
                onChangeDone={() => _websiteWithCompany.fetch({clean: false})}
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
                      .fetch({}, {
                        practice: practice,
                        ..._,
                      })
                      .then(_ => _websiteWithCompany.fetch({clean: false}))
                  }
                }}
                options={_practice.entity}
              >
                <StatusChip tooltipTitle={m.practice} value={_.practice ?? m.noValue} />
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
                    _createOrUpdate
                      .fetch({}, {
                        ..._,
                        investigationStatus: investigationStatus,
                      })
                      .then(_ => _websiteWithCompany.fetch({clean: false}))
                  }
                }}
                options={_investigationStatus.entity}
              >
                <StatusChip tooltipTitle={m.investigation} value={_.investigationStatus ? m.investigationStatus(_.investigationStatus) : m.noValue} />
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
                getValueName={_ => _.code + ' - ' + _.name}
                onChange={departmentDivision => {
                  if (departmentDivision && _.attribution === departmentDivision.code) {
                    toastInfo(m.alreadySelectedValue(departmentDivision?.name))
                  } else {
                    _createOrUpdate
                      .fetch({}, {
                        ..._,
                        attribution: departmentDivision?.code,
                      })
                      .then(_ => _websiteWithCompany.fetch({clean: false}))
                  }
                }}
                options={_departmentDivision.entity}
              >
                <StatusChip tooltipTitle={m.affectation} value={_.attribution ?? m.noValue} />
              </SelectInvestigationAttributes>
            ),
          },
          {
            id: 'status',
            stickyEnd: true,
            head: m.identified,
            render: _ => (
              <Switch
                checked={_.kind === WebsiteKind.DEFAULT}
                onChange={e => handleUpdateKind(_, e.target.checked ? WebsiteKind.DEFAULT : WebsiteKind.PENDING)}
              />
            ),
          },
          {
            id: 'status',
            stickyEnd: true,
            render: _ =>
              <>
                <WebsiteTools website={_} />
                <Tooltip title={m.delete}>
                  <IconBtn
                    loading={_remove.loading}
                    color="primary"
                    onClick={() => _remove
                      .fetch({}, _.id)
                      .then(_ => () => _websiteWithCompany.fetch({clean: false}))
                    }>
                    <Icon>delete</Icon>
                  </IconBtn>
                </Tooltip>
              </>,
          },
        ]}
      />
    </Panel>
  )
}
