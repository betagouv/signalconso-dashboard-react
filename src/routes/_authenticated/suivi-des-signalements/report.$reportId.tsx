import { createFileRoute } from '@tanstack/react-router'
import { useConnectedContext } from '../../../core/context/connected/connectedContext'
import { ReportComponent } from '../../../feature/Report/Report'
import { ReportPro } from '../../../feature/Report/ReportPro'

export const Route = createFileRoute(
  '/_authenticated/suivi-des-signalements/report/$reportId',
)({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : détail du signalement' }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { reportId } = Route.useParams()
  const { connectedUser } = useConnectedContext()
  return connectedUser.isPro ? (
    <ReportPro reportId={reportId} />
  ) : (
    <ReportComponent reportId={reportId} />
  )
}
