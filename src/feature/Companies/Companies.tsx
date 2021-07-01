import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {cleanObject, CompanySearch, CompanyWithReportsCount, ReportSearch} from '../../core/api'
import React, {useEffect} from 'react'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {InputBase, makeStyles, Theme} from '@material-ui/core'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {ScButton} from '../../shared/Button/Button'
import {utilsStyles} from '../../core/theme'
import {PageTab, PageTabs} from '../../shared/Layout/Page/PageTabs'
import {Fender} from 'mui-extension/lib'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'
import {useQueryString} from '../../core/utils/useQueryString'

const useStyles = makeStyles((t: Theme) => ({
  tdName_label: {
    fontWeight: 'bold',
    marginBottom: -1,
  },
  tdName_desc: {
    fontSize: t.typography.fontSize * 0.875,
    color: t.palette.text.hint,
  },
  tdAddress: {
    maxWidth: 300,
    ...utilsStyles(t).truncate,
  },
  fender: {
    margin: `${t.spacing(1)}px auto ${t.spacing(2)}px auto`,
  }
}))

export const Companies = () => {
  const {m, formatLargeNumber} = useI18n()
  const _companies = useCompaniesContext()
  const cssUtils = useUtilsCss()
  const css = useStyles()

  const queryString = useQueryString<Readonly<Partial<CompanySearch>>>()
  useEffect(() => {
    _companies.updateFilters({..._companies.initialFilters, ...queryString.get()})
  }, [])

  useEffect(() => {
    queryString.update(cleanObject(_companies.filters))
  }, [_companies.filters])

  useEffect(() => {
    _companies.fetch()
  }, [])

  return (
    <Page>
      <PageTitle>{m.company}</PageTitle>
      <PageTabs>
        <PageTab to="test" label={m.companiesActivated}/>
        <PageTab to="test" label={m.companiesToActivate}/>
      </PageTabs>
      <Panel>
        <Datatable<CompanyWithReportsCount>
          header={
            <>
              <SelectDepartments
                values={_companies.filters.departments}
                className={cssUtils.marginRight}
                onChange={departments => _companies.updateFilters(prev => ({...prev, departments}))}
              />
              <InputBase
                value={_companies.filters.identity}
                placeholder={m.companiesSearchPlaceholder} fullWidth className={cssUtils.marginLeft}
                onChange={event => _companies.updateFilters(prev => ({...prev, identity: event.target.value}))}/>
            </>
          }
          loading={_companies.fetching}
          data={_companies.list?.data}
          offset={_companies.filters.offset}
          limit={_companies.filters.limit}
          total={_companies.list?.totalSize}
          onPaginationChange={pagination => _companies.updateFilters(prev => ({...prev, ...pagination}))}
          getRenderRowKey={_ => _.siret}
          showColumnsToggle={true}
          rows={[
            {
              head: m.name,
              name: 'siret',
              row: _ =>
                <>
                  <span className={css.tdName_label}>{_.name}</span>
                  <br/>
                  <span className={css.tdName_desc}>{_.siret}</span>
                </>
            },
            {
              head: m.address,
              name: 'address',
              className: css.tdAddress,
              row: _ => (
                <span>{_.address}</span>
              )
            },
            {
              head: m.postalCodeShort,
              name: 'postalCode',
              row: _ =>
                <>
                  <span>{_.postalCode?.slice(0, 2)}</span>
                  <span className={cssUtils.colorDisabled}>{_.postalCode?.substr(2, 5)}</span>
                </>
            },
            {
              head: m.reports,
              name: 'count',
              className: cssUtils.txtRight,
              row: _ =>
                <NavLink to={siteMap.reports({siretSirenList: [_.siret]})}>
                  <ScButton color="primary">{formatLargeNumber(_.count)}</ScButton>
                </NavLink>
            },
          ]}
          renderEmptyState={
            <Fender title={m.noCompanyFound} icon="store" className={css.fender}>
              <ScButton variant="contained" color="primary" icon="add" className={cssUtils.marginTop}>
                {m.registerACompany}
              </ScButton>
            </Fender>
          }/>
      </Panel>
    </Page>
  )
}
