import { createFileRoute } from '@tanstack/react-router'
import {ReportsPro} from "../../feature/ReportsPro/ReportsPro";

export const Route = createFileRoute(
  '/_authenticated/suivi-des-signalements-clotures',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <ReportsPro reportType="closed" />
}
