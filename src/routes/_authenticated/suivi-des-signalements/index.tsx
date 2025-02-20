import { createFileRoute } from '@tanstack/react-router'
import {Reports} from "../../../feature/Reports/Reports";
import {useConnectedContext} from "../../../core/context/ConnectedContext";
import {ReportsPro} from "../../../feature/ReportsPro/ReportsPro";

export const Route = createFileRoute('/_authenticated/suivi-des-signalements/')({
  component: RouteComponent
})

function RouteComponent() {
  const { connectedUser } = useConnectedContext()
 return (
   connectedUser.isPro ? (
     <ReportsPro reportType="open" />
   ) : (
     <Reports />
   )
 )
}

