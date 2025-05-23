import {
  cleanObject,
  dateToApiTime,
  directDownloadBlob,
  wrap404AsNull,
} from '../../helper'
import {
  CompanySearchResult,
  ConsumerReview,
  Country,
  Event,
  FileOrigin,
  Id,
  IncomingReportResponse,
  PaginatedData,
  PaginatedFilters,
  PaginatedSearch,
  paginateFilters2QueryString,
  Report,
  ReportAction,
  ReportConsumerUpdate,
  ReportDeletionReason,
  ReportExtra,
  ReportSearch,
  ReportSearchResult,
  ReportTag,
  ReportWordCount,
  User,
} from '../../model'
import { ApiClient } from '../ApiClient'
import { generatePdfFileName, generateZipFileName } from './ReportExport'
import { ReportNodes } from './ReportNode'
import { ReportNodeSearch } from './ReportNodeSearch'
import { format } from 'date-fns'

interface ReportFilterQuerystring {
  readonly departments?: string[]
  readonly withTags?: ReportTag[]
  readonly withoutTags?: ReportTag[]
  readonly companyCountries?: string[]
  readonly siretSirenList?: string[]
  readonly status?: string[]
  readonly subcategories?: string[]
  start?: string
  end?: string
  email?: string
  websiteURL?: string
  phone?: string
  category?: string
  details?: string
  hasWebsite?: 'true' | 'false'
  hasPhone?: 'true' | 'false'
  hasForeignCountry?: 'true' | 'false'
  hasCompany?: 'true' | 'false'
}

export interface Albert {
  reportId: Id
  category?: string
  confidenceScore?: string
  explanation?: string
  summary?: string
  raw: string
  codeConsoCategory?: string
  codeConso?: string
}

export const reportFilter2QueryString = (
  report: ReportSearch,
): ReportFilterQuerystring => {
  try {
    const {
      hasCompany,
      hasForeignCountry,
      hasWebsite,
      hasPhone,
      start,
      end,
      hasResponseEvaluation,
      responseEvaluation,
      ...r
    } = report
    const parseBoolean = (
      _: keyof Pick<
        ReportSearch,
        'hasForeignCountry' | 'hasWebsite' | 'hasPhone' | 'hasCompany'
      >,
    ) =>
      report[_] !== undefined && { [_]: ('' + report[_]) as 'true' | 'false' }
    const parseDate = (_: keyof Pick<ReportSearch, 'start' | 'end'>) =>
      report[_] ? { [_]: dateToApiTime(report[_]) } : {}
    return {
      ...r,
      ...parseBoolean('hasCompany'),
      ...parseBoolean('hasWebsite'),
      ...parseBoolean('hasPhone'),
      ...parseBoolean('hasForeignCountry'),
      ...parseDate('start'),
      ...parseDate('end'),
      ...(hasResponseEvaluation !== undefined
        ? { hasEvaluation: hasResponseEvaluation }
        : null),
      ...(responseEvaluation !== undefined
        ? { evaluation: responseEvaluation }
        : null),
    }
  } catch (e) {
    console.error('Caught error on "reportFilter2QueryString"', report, e)
    return {}
  }
}

export const cleanReportFilter = (filter: ReportSearch): ReportSearch => {
  if (!filter.hasCompany) {
    delete filter.siretSirenList
  }
  if (!filter.hasForeignCountry) {
    delete filter.companyCountries
  }
  if (!filter.hasWebsite) {
    delete filter.websiteURL
  }
  if (!filter.hasPhone) {
    delete filter.phone
  }
  if (!filter.hasResponseEvaluation) {
    delete filter.responseEvaluation
  }
  return filter
}

export class ReportsClient {
  constructor(private client: ApiClient) {}

  private reportName = (report: Report) => {
    const day = String(report.creationDate.getDate()).padStart(2, '0')
    const month = String(report.creationDate.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
    const year = report.creationDate.getFullYear()
    return `${day}-${month}-${year}`
  }

  readonly downloadAll = async (report: Report, origin?: FileOrigin) => {
    const baseQuery = `/reports/${report.id}/files`
    return this.client
      .getBlob(origin ? `${baseQuery}?origin=${origin}` : baseQuery)
      .then((blob) =>
        directDownloadBlob(
          `${this.reportName(report)}-PJ`,
          'application/zip',
        )(blob),
      )
  }

  readonly extract = (filters: ReportSearch & PaginatedFilters) => {
    return this.client.post<void>(`reports/extract`, {
      qs: cleanObject({
        ...reportFilter2QueryString(cleanReportFilter(filters)),
        ...paginateFilters2QueryString(filters),
        zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    })
  }

  readonly extractAsZip = (filters: ReportSearch & PaginatedFilters) => {
    return this.client.post<void>(`reports/extract-as-zip`, {
      qs: cleanObject({
        ...reportFilter2QueryString(cleanReportFilter(filters)),
        ...paginateFilters2QueryString(filters),
      }),
    })
  }

  readonly search = (filters: ReportSearch & PaginatedSearch<Report>) => {
    const qs = cleanObject(reportFilter2QueryString(cleanReportFilter(filters)))
    return this.client
      .get<PaginatedData<ReportSearchResult>>(`/reports`, { qs })
      .then((result) => {
        result.entities.forEach((entity) => {
          entity.report = ReportsClient.mapReport(entity.report)
          entity.consumerReview =
            entity.consumerReview &&
            ReportsClient.mapConsumerReview(entity.consumerReview)
        })
        return result
      })
  }

  readonly download = (reportId: Id) => {
    return this.client
      .getBlob(`/reports/download/${reportId}`)
      .then(directDownloadBlob(generatePdfFileName(), 'application/pdf'))
  }

  readonly downloadZip = (reportId: Id) => {
    return this.client
      .getBlob(`/reports/download-with-attachments/${reportId}`)
      .then((blob) =>
        directDownloadBlob(generateZipFileName(), 'application/zip')(blob),
      )
  }

  readonly remove = (id: Id, reportDeletionReason: ReportDeletionReason) => {
    return this.client.delete<void>(`reports/${id}`, {
      body: { ...reportDeletionReason },
    })
  }

  readonly reOpen = (reportIds: Id[]) => {
    return this.client.post<void>(`reports/reopen`, {
      body: reportIds,
    })
  }

  readonly getById = async (id: Id): Promise<ReportExtra> => {
    const { report, ...rest } = await this.client.get<any>(`/reports/${id}`)
    return {
      ...rest,
      report: ReportsClient.mapReport(report),
    }
  }

  readonly getReviewOnReportResponse = async (reportId: Id) => {
    return wrap404AsNull(async () => {
      const res = await this.client.get<ConsumerReview>(
        `/reports/${reportId}/response/review`,
      )
      return ReportsClient.mapConsumerReview(res)
    })
  }

  readonly getEngagementReview = async (reportId: Id) => {
    return wrap404AsNull(async () => {
      const res = await this.client.get<ConsumerReview>(
        `/reports/${reportId}/engagement/review`,
      )
      return ReportsClient.mapConsumerReview(res)
    })
  }

  readonly generateConsumerNotificationAsPDF = (reportId: Id) => {
    return this.client
      .getBlob(`/reports/${reportId}/consumer-email-pdf`)
      .then(
        directDownloadBlob(
          'accuse-reception-consommateur.pdf',
          'application/pdf',
        ),
      )
  }

  readonly getCloudWord = (companyId: Id) => {
    return this.client.get<ReportWordCount[]>(`/reports/cloudword/${companyId}`)
  }

  readonly postResponse = (id: Id, response: IncomingReportResponse) => {
    return this.client.post<Event>(`reports/${id}/response`, {
      body: { ...response, fileIds: response.fileIds ?? [] },
    })
  }

  readonly classifyAndSummarize = (id: Id) => {
    return this.client.post<void>(`/albert/classification/${id}`)
  }

  readonly getAlbertClassification = (id: Id) => {
    return this.client.get<Albert>(`/albert/classification/${id}`)
  }

  readonly postAction = (id: Id, action: ReportAction) => {
    // const mappedAction: any = {...action, actionType: {value: action.actionType}}
    return this.client.post<Event>(`reports/${id}/action`, { body: action })
  }

  readonly updateReportCompany = (
    reportId: string,
    company: CompanySearchResult,
  ) => {
    return this.client
      .post<Report>(`/reports/${reportId}/company`, {
        body: {
          name: company.name,
          address: company.address,
          siret: company.siret,
          activityCode: company.activityCode,
          isHeadOffice: company.isHeadOffice,
          isOpen: company.isOpen,
          isPublic: company.isPublic,
        },
      })
      .then((report) => ReportsClient.mapReport(report))
  }

  readonly updateReportCountry = (reportId: string, country: Country) => {
    return this.client
      .put<Report>(`/reports/${reportId}/country`, {
        qs: { countryCode: country.code },
      })
      .then((report) => ReportsClient.mapReport(report))
  }

  readonly updateReportConsumer = (
    reportId: string,
    reportConsumerUpdate: ReportConsumerUpdate,
  ) => {
    return this.client
      .post<any>(`reports/${reportId}/consumer`, {
        body: reportConsumerUpdate,
      })
      .then((report) => ReportsClient.mapReport(report))
  }

  readonly updateReportAssignedUser = (
    reportId: string,
    newAssignedUserId: string,
    userComment: string,
  ) => {
    return this.client.post<User>(
      `reports/${reportId}/assign/${newAssignedUserId}`,
      {
        body: { comment: userComment },
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  readonly getCountByDepartments = ({
    start,
    end,
  }: { start?: Date; end?: Date } = {}): Promise<[string, number][]> => {
    return this.client.get(`/stats/reports/count-by-departments`, {
      qs: {
        start: dateToApiTime(start),
        end: dateToApiTime(end),
      },
    })
  }

  readonly getCountBySubCategories = ({
    start,
    end,
    departments,
  }: ReportNodeSearch = {}): Promise<ReportNodes> => {
    return this.client.get(`/stats/reports/count-by-subcategories`, {
      qs: {
        start: dateToApiTime(start),
        end: dateToApiTime(end),
        departments: departments,
      },
    })
  }

  readonly downloadCountBySubCategories = ({
    lang,
    start,
    end,
    departments,
  }: ReportNodeSearch & { lang: string }): Promise<void> => {
    return this.client
      .getBlob(`/stats/reports/count-by-subcategories/download`, {
        qs: {
          lang,
          start: dateToApiTime(start),
          end: dateToApiTime(end),
          departments: departments,
        },
      })
      .then(
        directDownloadBlob(
          `signalements_par_souscategories_${new Date().toISOString()}.csv`,
          'text/csv',
        ),
      )
  }

  readonly setBookmarked = ({
    reportId,
    bookmarked,
  }: {
    reportId: string
    bookmarked: boolean
  }): Promise<unknown> => {
    if (bookmarked) {
      return this.client.post(`/reports/${reportId}/bookmark`)
    } else {
      return this.client.delete(`/reports/${reportId}/bookmark`)
    }
  }

  readonly countBookmarks = (): Promise<number> => {
    return this.client.get<number>(`/reports/bookmarks/count`)
  }

  static readonly mapReport = (report: {
    [key in keyof Report]: any
  }): Report => ({
    ...report,
    creationDate: new Date(report.creationDate),
    expirationDate: new Date(report.expirationDate),
  })

  static readonly mapConsumerReview = (_: {
    [key in keyof ConsumerReview]: any
  }): ConsumerReview => {
    return {
      ..._,
      creationDate: new Date(_.creationDate),
    }
  }
}
