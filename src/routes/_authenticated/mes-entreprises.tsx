import { createFileRoute } from '@tanstack/react-router'
import {CompaniesPro} from "../../feature/CompaniesPro/CompaniesPro";

export const Route = createFileRoute('/_authenticated/mes-entreprises')({
  component: CompaniesPro,
})
