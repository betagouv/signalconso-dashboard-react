import { createFileRoute } from '@tanstack/react-router'
import { Reports } from '../../../feature/Reports/Reports'
import { useConnectedContext } from '../../../core/context/ConnectedContext'
import { ReportsPro } from '../../../feature/ReportsPro/ReportsPro'
import { ReportSearch } from '../../../core/client/report/ReportSearch'
import {
  Id,
  PaginatedFilters,
  ReportStatus,
  ReportTag,
  ResponseEvaluation,
} from '../../../core/model'

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
        hasConsumerPhone: (search.hasConsumerPhone as boolean) || undefined,
        websiteURL: (search.websiteURL as string) || undefined,
        phone: (search.phone as string) || undefined,
        category: (search.category as string) || undefined,
        subcategories: (search.subcategories as string[]) || undefined,
        details: (search.details as string) || undefined,
        description: (search.description as string) || undefined,
        contactAgreement: (search.contactAgreement as boolean) || undefined,
        hasPhone: (search.hasPhone as boolean) || undefined,
        hasWebsite: (search.hasWebsite as boolean) || undefined,
        hasForeignCountry: (search.hasForeignCountry as boolean) || undefined,
        hasCompany: (search.hasCompany as boolean) || undefined,
        hasAttachment: (search.hasAttachment as boolean) || undefined,
        hasResponseEvaluation:
          (search.hasResponseEvaluation as boolean) || undefined,
        responseEvaluation:
          (search.responseEvaluation as ResponseEvaluation[]) || undefined,
        hasEngagementEvaluation:
          (search.hasEngagementEvaluation as boolean) || undefined,
        engagementEvaluation:
          (search.engagementEvaluation as ResponseEvaluation[]) || undefined,
        fullText: (search.fullText as string) || undefined,
        isForeign: (search.isForeign as boolean) || undefined,
        hasBarcode: (search.hasBarcode as boolean) || undefined,
        isBookmarked: (search.isBookmarked as boolean) || undefined,

        offset: (search.offset as number) || 0,
        limit: (search.limit as number) || 25,
      }
    },
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
