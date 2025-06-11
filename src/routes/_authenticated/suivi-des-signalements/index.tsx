import { createFileRoute } from '@tanstack/react-router'
import { ReportSearch } from '../../../core/client/report/ReportSearch'
import { useConnectedContext } from '../../../core/context/connected/connectedContext'
import { unknownToBoolean } from '../../../core/helper'
import {
  Id,
  PaginatedFilters,
  ReportStatus,
  ReportTag,
  ResponseEvaluation,
} from '../../../core/model'
import { Reports } from '../../../feature/Reports/Reports'
import { ReportsPro } from '../../../feature/ReportsPro/ReportsPro'

export const Route = createFileRoute('/_authenticated/suivi-des-signalements/')(
  {
    validateSearch: (
      search: Record<string, unknown>,
    ): ReportSearch & Partial<PaginatedFilters> => {
      return {
        departments: (search.departments as string[]) || undefined,
        withTags: (search.withTags as ReportTag[]) || undefined,
        withoutTags: (search.withoutTags as ReportTag[]) || undefined,
        companyCountries: (search.companyCountries as string[]) || undefined,
        siretSirenList: (search.siretSirenList as string[]) || undefined,
        activityCodes: (search.activityCodes as string[]) || undefined,
        status: (search.status as ReportStatus[]) || undefined,
        companyIds: (search.companyIds as Id[]) || undefined,
        start: search.start ? new Date(search.start as string) : undefined,
        end: search.end ? new Date(search.end as string) : undefined,
        email: (search.email as string) || undefined,
        consumerPhone: (search.consumerPhone as string) || undefined,
        hasConsumerPhone: unknownToBoolean(search.hasConsumerPhone),
        websiteURL: (search.websiteURL as string) || undefined,
        phone: (search.phone as string) || undefined,
        category: (search.category as string) || undefined,
        subcategories: (search.subcategories as string[]) || undefined,
        details: (search.details as string) || undefined,
        contactAgreement: unknownToBoolean(search.contactAgreement),
        hasPhone: unknownToBoolean(search.hasPhone),
        hasWebsite: unknownToBoolean(search.hasWebsite),
        hasForeignCountry: unknownToBoolean(search.hasForeignCountry),
        hasCompany: unknownToBoolean(search.hasCompany),
        hasAttachment: unknownToBoolean(search.hasAttachment),
        hasResponseEvaluation: unknownToBoolean(search.hasResponseEvaluation),
        responseEvaluation:
          (search.responseEvaluation as ResponseEvaluation[]) || undefined,
        hasEngagementEvaluation: unknownToBoolean(
          search.hasEngagementEvaluation,
        ),
        engagementEvaluation:
          (search.engagementEvaluation as ResponseEvaluation[]) || undefined,
        fullText: (search.fullText as string) || undefined,
        isForeign: unknownToBoolean(search.isForeign),
        hasBarcode: unknownToBoolean(search.hasBarcode),
        isBookmarked: unknownToBoolean(search.isBookmarked),

        offset: (search.offset as number) || 0,
        limit: (search.limit as number) || 25,
      }
    },
    head: () => ({
      meta: [{ title: 'Espace pro Signal Conso : suivi des signalements' }],
    }),
    component: RouteComponent,
  },
)

function RouteComponent() {
  const { connectedUser } = useConnectedContext()
  const search = Route.useSearch()
  return connectedUser.isPro ? (
    <ReportsPro reportType="open" search={search} />
  ) : (
    <Reports search={search} />
  )
}
