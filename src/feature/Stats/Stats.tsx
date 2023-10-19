import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom'
import {Page, PageTitle} from 'shared/Page'
import {useI18n} from '../../core/i18n'
import {siteMap} from '../../core/siteMap'
import {PageTab, PageTabs} from '../../shared/Page/PageTabs'
import {DgccrfStats} from './DgccrfStats'
import {ProStats} from './ProStats'
import {ReportStats} from './ReportStats'
import {ArborescenceWithCounts} from './ArborescenceWithCounts'
import {useLogin} from '../../core/context/LoginContext'

export const Stats = () => {
  const {path} = useRouteMatch()
  const {m} = useI18n()
  const {connectedUser} = useLogin()
  return (
    <Page>
      <PageTitle>{m.statsLandingPage}</PageTitle>
      {connectedUser.isDGAL ? (
        <PageTabs>
          <PageTab to={siteMap.logged.proStats} label={m.statsPro} />
          <PageTab to={siteMap.logged.countBySubCategories} label={m.statsCountBySubCategoriesTab} />
        </PageTabs>
      ) : (
        <PageTabs>
          <PageTab to={siteMap.logged.reportStats} label={m.statsReports} />
          <PageTab to={siteMap.logged.proStats} label={m.statsPro} />
          <PageTab to={siteMap.logged.dgccrfStats} label={m.statsDgccrf} />
          <PageTab to={siteMap.logged.countBySubCategories} label={m.statsCountBySubCategoriesTab} />
        </PageTabs>
      )}
      {connectedUser.isDGAL ? (
        <Switch>
          <Redirect exact from={path} to={siteMap.logged.proStats} />
          <Route path={siteMap.logged.proStats} component={ProStats} />
          <Route path={siteMap.logged.countBySubCategories} component={ArborescenceWithCounts} />
        </Switch>
      ) : (
        <Switch>
          <Redirect exact from={path} to={siteMap.logged.reportStats} />
          <Route path={siteMap.logged.reportStats} component={ReportStats} />
          <Route path={siteMap.logged.proStats} component={ProStats} />
          <Route path={siteMap.logged.dgccrfStats} component={DgccrfStats} />
          <Route path={siteMap.logged.countBySubCategories} component={ArborescenceWithCounts} />
        </Switch>
      )}
    </Page>
  )
}
