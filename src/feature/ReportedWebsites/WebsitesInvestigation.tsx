import React, {useEffect, useMemo} from 'react'
import {useI18n} from '../../core/i18n'
import {Badge, Icon, InputBase, Switch, Tooltip} from '@mui/material'
import {useToast} from '../../core/toast'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {useReportedWebsiteWithCompanyContext} from '../../core/context/ReportedWebsitesContext'
import {cleanObject, Company, DepartmentDivision,
  Id,
  IdentificationStatus,
  WebsiteWithCompany
} from '@signal-conso/signalconso-api-sdk-js'
import {IconBtn} from 'mui-extension'
import {useWebsiteInvestigationContext} from '../../core/context/WebsiteInvestigationContext'
import {StatusChip} from './StatusChip'
import {WebsitesFilters} from './WebsitesFilters'
import {SelectWebsiteIdentification} from './SelectWebsiteIdentification/SelectWebsiteIdentification'
import {AutocompleteDialog} from '../../shared/AutocompleteDialog/AutocompleteDialog'
import {useEffectFn, useMap} from '@alexandreannic/react-hooks-lib'
import {WebsiteTools} from './WebsiteTools'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {groupBy} from '../../core/lodashNamedExport'
import {map} from '@alexandreannic/ts-utils'
import {sxUtils} from '../../core/theme'
import {useMemoFn} from '@alexandreannic/react-hooks-lib/lib'

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

  const departmentDivisionIndex = useMemoFn(
    _departmentDivision.entity,
    deps => groupBy(deps, _ => _.code),
  )

  const websitesIndex = useMap<Id, WebsiteWithCompany>()
  useEffectFn(_websiteWithCompany.list, w => websitesIndex.reset(w.data, _ => _.id))

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

  const handleUpdateKind = (website: WebsiteWithCompany, identificationStatus: IdentificationStatus) => {
    _updateStatus.fetch({}, website.id, identificationStatus)
    websitesIndex.set(website.id, {...website, identificationStatus})
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
        data={websitesIndex.values()}
        showColumnsToggle={true}
        columns={[
          {
            id: 'host',
            head: m.website,
            render: _ => <Txt link><a href={'https://' + _.host}>{_.host}</a></Txt>,
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
              <SelectWebsiteIdentification
                website={_}
                onChange={(company, companyCountry) => {
                  // TODO(Saïd) Not sure it is clean.
                  // Can address and name be undefined in WebsiteUpdateCompany if they are not in Company.
                  const dummyCompany: Company | undefined = company !== undefined ? {
                    ...company,
                    address: company.address ?? {},
                    id: 'temp' + Math.random(),
                    creationDate: new Date(),
                    name: company?.name ?? '',
                  } : undefined
                  websitesIndex.set(_.id, {..._, company: dummyCompany, companyCountry})
                }}
              />
            ),
          },
          {
            head: m.practice,
            id: 'practice',
            render: _ => (
              <AutocompleteDialog<string>
                value={_.practice}
                title={m.practiceTitle}
                inputLabel={m.practice}
                getOptionLabel={_ => _}
                onChange={practice => {
                  if (_.practice === practice) {
                    toastInfo(m.alreadySelectedValue(practice))
                  } else {
                    _createOrUpdate.fetch({}, {practice: practice, ..._})
                    websitesIndex.set(_.id, {..._, practice})
                  }
                }}
                options={_practice.entity}
              >
                <StatusChip tooltipTitle={m.practice} value={_.practice ?? m.noValue} />
              </AutocompleteDialog>
            ),
          },
          {
            head: m.investigation,
            id: 'investigationStatus',
            render: _ => (
              <AutocompleteDialog<string>
                value={_.investigationStatus}
                title={m.affectationTitle}
                inputLabel={m.affectation}
                getOptionLabel={_ => m.investigationStatus(_)}
                options={_investigationStatus.entity}
                onChange={investigationStatus => {
                  if (_.investigationStatus === investigationStatus) {
                    toastInfo(m.alreadySelectedValue(investigationStatus))
                  } else {
                    _createOrUpdate.fetch({}, {..._, investigationStatus})
                    websitesIndex.set(_.id, {..._, investigationStatus})
                  }
                }}
              >
                <StatusChip tooltipTitle={m.investigation} value={_.investigationStatus ? m.investigationStatus(_.investigationStatus) : m.noValue} />
              </AutocompleteDialog>
            ),
          },
          {
            head: m.affectation,
            id: 'affectation',
            render: w => (
              <AutocompleteDialog<DepartmentDivision>
                value={map(w.attribution, departmentDivisionIndex, (attribution, dep) => dep[attribution][0])}
                title={m.affectationTitle}
                inputLabel={m.affectation}
                getOptionLabel={_ => _.code + ' - ' + _.name}
                options={_departmentDivision.entity}
                onChange={departmentDivision => {
                  if (departmentDivision && w.attribution === departmentDivision.code) {
                    toastInfo(m.alreadySelectedValue(departmentDivision?.name))
                  } else {
                    _createOrUpdate.fetch({}, {...w, attribution: departmentDivision?.code})
                    websitesIndex.set(w.id, {...w, attribution: departmentDivision?.code})
                  }
                }}
              >
                <StatusChip tooltipTitle={m.affectation} value={w.attribution ?? m.noValue} />
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
                onChange={e => handleUpdateKind(_, e.target.checked ? IdentificationStatus.Identified : IdentificationStatus.NotIdentified)}
              />
            ),
          },
          {
            id: 'status',
            stickyEnd: true,
            sx: _ => sxUtils.tdActions,
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
