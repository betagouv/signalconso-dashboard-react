import { createFileRoute } from '@tanstack/react-router'
import { ReportedPhones } from '../../feature/ReportedPhones/ReportedPhones'

export const Route = createFileRoute('/_authenticated/suivi-des-telephones')({
  head: () => ({
    meta: [{ title: 'Espace pro Signal Conso : Téléphones signalés' }],
  }),
  component: ReportedPhones,
})
