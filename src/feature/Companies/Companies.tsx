import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import React from 'react'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {makeStyles, Theme} from '@material-ui/core'
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {PageTab, PageTabs} from '../../shared/Layout/Page/PageTabs'
import {CompaniesToActivate} from './CompaniesToActivate'
import {CompaniesRegistered} from './CompaniesRegistered'

const useStyles = makeStyles((t: Theme) => ({}))

export const Companies = () => {
  const {m,} = useI18n()
  const cssUtils = useUtilsCss()
  const css = useStyles()
  const {path, url} = useRouteMatch()

  console.log(path, url)
  return (
    <Page>
      <PageTitle>{m.company}</PageTitle>
      <PageTabs>
        <PageTab to={siteMap.companies_registered} label={m.companiesActivated}/>
        <PageTab to={siteMap.companies_toActivate} label={m.companiesToActivate}/>
      </PageTabs>
      <Switch>
        <Redirect exact from={path} to={siteMap.companies_registered}/>
        <Route path={siteMap.companies_registered} component={CompaniesRegistered}/>
        <Route path={siteMap.companies_toActivate} component={CompaniesToActivate}/>
      </Switch>
    </Page>
  )
}
