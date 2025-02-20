import { createFileRoute } from '@tanstack/react-router'
import {ArborescenceWithCounts} from "../../../feature/Stats/ArborescenceWithCounts";

export const Route = createFileRoute(
  '/_authenticated/stats/countBySubCategories',
)({
  component: ArborescenceWithCounts,
})
