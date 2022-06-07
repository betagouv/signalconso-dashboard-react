import React, {useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {
  Badge,
  Box,
  Chip,
  FormControlLabel,
  Icon,
  InputBase,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Switch,
  Theme,
  Tooltip,
} from '@mui/material'
import {useToast} from '../../core/toast'
import {fromNullable} from 'fp-ts/lib/Option'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {DebouncedInput} from '../../shared/DebouncedInput/DebouncedInput'
import {useReportedWebsiteWithCompanyContext} from '../../core/context/ReportedWebsitesContext'
import {Country, DepartmentDivision, WebsiteKind, WebsiteWithCompany} from '@signal-conso/signalconso-api-sdk-js'
import {IconBtn} from 'mui-extension'
import {SelectCompany} from '../../shared/SelectCompany/SelectCompany'
import {useConstantContext} from '../../core/context/ConstantContext'
import {SelectCountry} from './SelectCountry'
import {useWebsiteInvestigationContext} from '../../core/context/WebsiteInvestigationContext'
import {CountryChip} from './CountryChip'
import {CompanyChip} from './CompanyChip'
import {StatusChip} from './StatusChip'
import {SelectXXXX} from './SelectXXXX'
import {ScSelect} from "../../shared/Select/Select";
import {ScMenuItem} from "../MenuItem/MenuItem";
import {ReportFilters} from "../Reports/ReportsFilters";
import {WebsitesFilters} from "./WebsitesFilters";

const useAnchoredMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = (event: any) => setAnchorEl(event.currentTarget)
  const close = () => setAnchorEl(null)
  return {open, close, element: anchorEl}
}

export const WebsitesInvestigation = () => {
  const {m, formatDate} = useI18n()

  const _countries = useConstantContext().countries
  const _websiteInvestigation = useWebsiteInvestigationContext().getWebsiteInvestigation
  const _createOrUpdate = useWebsiteInvestigationContext().createOrUpdateInvestigation
  const _departmentDivision = useWebsiteInvestigationContext().listDepartmentDivision
  const _practice = useWebsiteInvestigationContext().listPractice
  const _investigationStatus = useWebsiteInvestigationContext().listInvestigationStatus
  const _updateStatus = useReportedWebsiteWithCompanyContext().update
  const _updateCompany = useReportedWebsiteWithCompanyContext().updateCompany
  const _updateCountry = useReportedWebsiteWithCompanyContext().updateCountry
  const [countries, setCountries] = useState<Country[]>([])
  const [departmentDivision, setDepartmentDivision] = useState<DepartmentDivision[]>([])
  const [investigationStatus, setInvestigationStatus] = useState<string[]>([])
  const [practice, setPractice] = useState<string[]>([])
  const countriesAnchor = useAnchoredMenu()
  const {toastError, toastInfo, toastSuccess} = useToast()

  useEffect(() => {
    _websiteInvestigation.updateFilters({..._websiteInvestigation.initialFilters})
  }, [])

  useEffect(() => {
    _websiteInvestigation.fetch()
  }, [])

  useEffect(() => {
    _countries.fetch({}).then(setCountries)
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
  }, [_updateStatus.error])

  useEffect(() => {
    fromNullable(_websiteInvestigation.error).map(toastError)
  }, [_websiteInvestigation.error])

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
          updateFilters={ _ => {_websiteInvestigation.updateFilters(prev => ({...prev, ..._}))}}>
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
            id: 'status',
            head: '',
            render: _ =>
              _.kind === WebsiteKind.DEFAULT ? (
                <Tooltip title={m.associationDone}>
                  <Icon sx={{color: t => t.palette.success.light}}>check_circle</Icon>
                </Tooltip>
              ) : (
                <Tooltip title={m.needAssociation}>
                  <Icon sx={{color: t => t.palette.warning.main}}>check_circle</Icon>
                </Tooltip>
              ),
          },
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
            head: m.company,
            id: 'company',
            render: _ => (
              <SelectCompany
                siret={_.company?.siret}
                onChange={company => {
                  if (_.company?.siret === company.siret) {
                    toastInfo(m.alreadySelectedCompany(company.name))
                  } else {
                    _updateCompany
                      .fetch({}, _.id, {
                        siret: company.siret,
                        name: company.name,
                        address: company.address,
                        activityCode: company.activityCode,
                      })
                      .then(_ => _websiteInvestigation.fetch({clean: false}))
                  }
                }}
              >
                <CompanyChip company={_.company} />
              </SelectCompany>
            ),
          },
          {
            head: m.foreignCountry,
            id: 'company_country',
            render: _ => (
              <SelectCountry
                country={_.companyCountry}
                onChange={companyCountry => {
                  if (_.companyCountry === companyCountry) {
                    toastInfo(m.alreadySelectedCountry(companyCountry?.name))
                  } else {
                    _updateCountry.fetch({}, _.id, companyCountry).then(_ => _websiteInvestigation.fetch({clean: false}))
                  }
                }}
              >
                <CountryChip country={_.companyCountry} />
              </SelectCountry>
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
                <StatusChip tooltipTitle={m.practice} value={_.practice ?? m.noValue} />
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
                    _createOrUpdate
                      .fetch(
                        {},
                        {
                          ..._,
                          investigationStatus: investigationStatus,
                        },
                      )
                      .then(_ => _websiteInvestigation.fetch({clean: false}))
                  }
                }}
                listValues={investigationStatus}
              >
                <StatusChip tooltipTitle={m.investigation} value={_.investigationStatus ?? m.noValue} />
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
                  if (_.attribution === departmentDivision.code) {
                    toastInfo(m.alreadySelectedValue(departmentDivision?.name))
                  } else {
                    _createOrUpdate
                      .fetch(
                        {},
                        {
                          attribution: departmentDivision.code,
                          ..._,
                        },
                      )
                      .then(_ => _websiteInvestigation.fetch({clean: false}))
                  }
                }}
                listValues={departmentDivision}
              >
                <StatusChip tooltipTitle={m.affectation} value={_.attribution ?? m.noValue} />
              </SelectXXXX>
            ),
          },
        ]}
      />
    </Panel>
  )
}
