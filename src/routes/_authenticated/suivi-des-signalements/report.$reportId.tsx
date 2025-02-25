import { createFileRoute } from '@tanstack/react-router'
import { useConnectedContext } from '../../../core/context/ConnectedContext'
import { ReportPro } from '../../../feature/Report/ReportPro'
import { ReportComponent } from '../../../feature/Report/Report'

export const Route = createFileRoute(
  '/_authenticated/suivi-des-signalements/report/$reportId',
)({
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
