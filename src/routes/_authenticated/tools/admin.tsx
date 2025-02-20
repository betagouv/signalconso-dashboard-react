import { createFileRoute } from '@tanstack/react-router'
import {AdminTools} from "../../../feature/AdminTools/AdminTools";

export const Route = createFileRoute('/_authenticated/tools/admin')({
  component: AdminTools,
})
