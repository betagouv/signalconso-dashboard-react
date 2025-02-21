import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '../../feature/Settings/Settings'

export const Route = createFileRoute('/_authenticated/parametres/')({
  component: Settings,
})
