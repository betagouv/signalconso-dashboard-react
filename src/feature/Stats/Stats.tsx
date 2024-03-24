import {Route, useResolvedPath} from 'react-router-dom'
import {Page, PageTitle} from 'shared/Page'
import {useI18n} from '../../core/i18n'
import {siteMap} from '../../core/siteMap'
import {PageTab, PageTabs} from '../../shared/Page/PageTabs'
import {DgccrfStats} from './DgccrfStats'
import {ProStats} from './ProStats'
import {ReportStats} from './ReportStats'
import {ArborescenceWithCounts} from './ArborescenceWithCounts'
import {useLogin} from '../../core/context/LoginContext'
import {config} from 'conf/config'
import {Navigate, Routes} from 'react-router'

export const Stats = () => {
  const {m} = useI18n()
  const {connectedUser} = useLogin()
  return (
    <Page>
      <PageTitle>{m.statsLandingPage}</PageTitle>
      <p className="mb-4">
        D'autres statistiques sont accessibles directement sur le{' '}
        <a href={`${config.appBaseUrl}/fr/stats`} target="blank">
          site de SignalConso
        </a>{' '}
        et sur{' '}
        <a href={`https://data.economie.gouv.fr/pages/signalconso/`} target="blank">
          DataEconomie
        </a>
        .
      </p>
      {connectedUser.isDGAL ? (
        <PageTabs>
          <PageTab to={siteMap.logged.stats.pro.value} label={m.statsPro} />
          <PageTab to={siteMap.logged.stats.countBySubCategories.value} label={m.statsCountBySubCategoriesTab} />
        </PageTabs>
      ) : (
        <PageTabs>
          <PageTab to={siteMap.logged.stats.report.value} label={m.statsReports} />
          <PageTab to={siteMap.logged.stats.pro.value} label={m.statsPro} />
          <PageTab to={siteMap.logged.stats.dgccrf.value} label={m.statsDgccrf} />
          <PageTab to={siteMap.logged.stats.countBySubCategories.value} label={m.statsCountBySubCategoriesTab} />
        </PageTabs>
      )}
      {connectedUser.isDGAL ? (
        <Routes>
          <Route path="/*" element={<Navigate replace to={siteMap.logged.stats.pro.value} />} />
          <Route path={siteMap.logged.stats.pro.value} element={<ProStats />} />
          <Route path={siteMap.logged.stats.countBySubCategories.value} element={<ArborescenceWithCounts />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/*" element={<Navigate replace to={siteMap.logged.stats.report.value} />} />
          <Route path={siteMap.logged.stats.report.value} element={<ReportStats />} />
          <Route path={siteMap.logged.stats.pro.value} element={<ProStats />} />
          <Route path={siteMap.logged.stats.dgccrf.value} element={<DgccrfStats />} />
          <Route path={siteMap.logged.stats.countBySubCategories.value} element={<ArborescenceWithCounts />} />
        </Routes>
      )}
    </Page>
  )
}
