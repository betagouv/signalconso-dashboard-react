import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {CompanyWithReportsCount} from '../../core/api'
import React, {useEffect} from 'react'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {InputBase, makeStyles, Theme} from '@material-ui/core'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {ScButton} from '../../shared/Button/Button'
import {utilsStyles} from '../../core/theme'

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
  }
}))

export const Companies = () => {
  const {m, formatLargeNumber} = useI18n()
  const _companies = useCompaniesContext()
  const cssUtils = useUtilsCss()
  const css = useStyles()

  useEffect(() => {
    _companies.fetch()
  }, [])

  return (
    <Page>
      <PageTitle>{m.company}</PageTitle>
      <Panel>
        <Datatable<CompanyWithReportsCount>
          header={<InputBase placeholder={m.companiesSearchPlaceholder} fullWidth onChange={event => _companies.updateFilters(prev => ({...prev, identity: event.target.value}))}/>}
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
          ]}/>
      </Panel>
    </Page>
  )
}
