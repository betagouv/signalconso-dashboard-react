import { createFileRoute } from '@tanstack/react-router'
import {ProStats} from "../../../feature/Stats/ProStats";

export const Route = createFileRoute('/_authenticated/stats/pro-stats')({
  component: ProStats,
})