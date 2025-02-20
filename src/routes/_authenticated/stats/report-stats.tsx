import { createFileRoute } from '@tanstack/react-router'
import {ReportStats} from "../../../feature/Stats/ReportStats";

export const Route = createFileRoute('/_authenticated/stats/report-stats')({
  component: ReportStats,
})
