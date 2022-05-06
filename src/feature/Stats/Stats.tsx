import {Page, PageTitle} from 'shared/Layout'
import * as React from 'react'
import {CountByDate} from '@signal-conso/signalconso-api-sdk-js'
import {useI18n} from '../../core/i18n'
import {I18nContextProps} from '../../core/i18n/I18n'
import {ProStats} from './ProStats'
import {DgccrfStats} from './DgccrfStats'
import {PageTab, PageTabs} from '../../shared/Layout/Page/PageTabs'
import {siteMap} from '../../core/siteMap'
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {ReportStats} from './ReportStats'
import {DataEconomie} from "./DataEconomie";

export const statsFormatCurveDate =
  (m: I18nContextProps['m']) =>
  ({date, count}: CountByDate): {date: string; count: number} => ({
    date: (m.monthShort_ as any)[date.getMonth() + 1],
    count,
  })

export const Stats = () => {
  const {path} = useRouteMatch()
  const {m} = useI18n()
  return (
    <Page>
      <PageTitle>{m.statsLandingPage}</PageTitle>
      <PageTabs>
        <PageTab to={siteMap.logged.reportStats} label={m.statsReports} />
        <PageTab to={siteMap.logged.proStats} label={m.statsPro} />
        <PageTab to={siteMap.logged.dgccrfStats} label={m.statsDgccrf} />
        <PageTab to={siteMap.logged.dataEconomie} label={m.dataEconomie} />
      </PageTabs>
      <Switch>
        <Redirect exact from={path} to={siteMap.logged.reportStats} />
        <Route path={siteMap.logged.reportStats} component={ReportStats} />
        <Route path={siteMap.logged.proStats} component={ProStats} />
        <Route path={siteMap.logged.dgccrfStats} component={DgccrfStats} />
        <Route path={siteMap.logged.dataEconomie} component={DataEconomie} />
      </Switch>
    </Page>
  )
}
