import { createFileRoute, Outlet } from '@tanstack/react-router'
import { config } from '../../conf/config'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useI18n } from '../../core/i18n'
import { Page, PageTitle } from '../../shared/Page'
import { PageTab, PageTabs } from '../../shared/Page/PageTabs'
import { Route as countBySubCategoriesRoute } from './stats/countBySubCategories'
import { Route as dgccrfStatsRoute } from './stats/dgccrf-stats'
import { Route as proStatsRoute } from './stats/pro-stats'
import { Route as reportStatsRoute } from './stats/report-stats'

export const Route = createFileRoute('/_authenticated/stats')({
  component: Stats,
})

function Stats() {
  const { m } = useI18n()
  const { connectedUser } = useConnectedContext()
  return (
    <Page>
      <PageTitle>{m.statsLandingPage}</PageTitle>
      <p className="mb-4">
        D'autres statistiques sont accessibles directement sur le{' '}
        <a href={`${config.appBaseUrl}/fr/stats`} target="blank">
          site de SignalConso
        </a>{' '}
        et sur{' '}
        <a
          href={`https://data.economie.gouv.fr/pages/signalconso/`}
          target="blank"
        >
          DataEconomie
        </a>
        .
      </p>
      {connectedUser.isDGAL ? (
        <PageTabs>
          <PageTab to={proStatsRoute.to} label={m.statsPro} />
          <PageTab
            to={countBySubCategoriesRoute.to}
            label={m.statsCountBySubCategoriesTab}
          />
        </PageTabs>
      ) : (
        <PageTabs>
          <PageTab to={reportStatsRoute.to} label={m.statsReports} />
          <PageTab to={proStatsRoute.to} label={m.statsPro} />
          <PageTab to={dgccrfStatsRoute.to} label={m.statsDgccrf} />
          <PageTab
            to={countBySubCategoriesRoute.to}
            label={m.statsCountBySubCategoriesTab}
          />
        </PageTabs>
      )}
      <Outlet />
    </Page>
  )
}
