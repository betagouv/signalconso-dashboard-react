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
  // const path = useResolvedPath('').pathname
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
        <Routes>
          <Route path="/" element={<Navigate replace to={siteMap.logged.proStats} />} />
          <Route path={siteMap.logged.proStats} element={<ProStats />} />
          <Route path={siteMap.logged.countBySubCategories} element={<ArborescenceWithCounts />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate replace to={siteMap.logged.reportStats} />} />
          <Route path={siteMap.logged.reportStats} element={<ReportStats />} />
          <Route path={siteMap.logged.proStats} element={<ProStats />} />
          <Route path={siteMap.logged.dgccrfStats} element={<DgccrfStats />} />
          <Route path={siteMap.logged.countBySubCategories} element={<ArborescenceWithCounts />} />
        </Routes>
      )}
    </Page>
  )
}
