import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useI18n } from '../../core/i18n'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { Page, PageTitle } from '../../shared/Page'
import { PageTab, PageTabs } from '../../shared/Page/PageTabs'
import { config } from '../../conf/config'
import { Route as reportStatsRoute } from './stats/report-stats'
import { Route as dgccrfStatsRoute } from './stats/dgccrf-stats'
import { Route as proStatsRoute } from './stats/pro-stats'
import { Route as countBySubCategoriesRoute } from './stats/countBySubCategories'

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
          <PageTab
            navigateOptions={{ to: proStatsRoute.to }}
            label={m.statsPro}
          />
          <PageTab
            navigateOptions={{ to: countBySubCategoriesRoute.to }}
            label={m.statsCountBySubCategoriesTab}
          />
        </PageTabs>
      ) : (
        <PageTabs>
          <PageTab
            navigateOptions={{ to: reportStatsRoute.to }}
            label={m.statsReports}
          />
          <PageTab
            navigateOptions={{ to: proStatsRoute.to }}
            label={m.statsPro}
          />
          <PageTab
            navigateOptions={{ to: dgccrfStatsRoute.to }}
            label={m.statsDgccrf}
          />
          <PageTab
            navigateOptions={{ to: countBySubCategoriesRoute.to }}
            label={m.statsCountBySubCategoriesTab}
          />
        </PageTabs>
      )}
      <Outlet />
    </Page>
  )
}
