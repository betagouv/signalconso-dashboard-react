import {
  Address,
  CompanySearchResult,
  Id,
  PaginatedData,
  PaginatedFilters,
  paginateFilters2QueryString,
  Report,
  ReportAction,
  ReportResponse,
  ReportSearch,
  ReportSearchResult,
  ReportTag,
  ReportWordCount,
  ResponseConsumerReview,
  ReportConsumerUpdate,
} from '../../model'
import {ApiSdkLogger} from '../../helper/Logger'
import {ApiClientApi} from '../ApiClient'
import {cleanObject, dateToApiDate, dateToApiTime, directDownloadBlob} from '../../helper'
import {NamedReportSearch} from './NamedReportSearch'

export interface ReportFilterQuerystring {
  readonly departments?: string[]
  readonly withTags?: ReportTag[]
  readonly withoutTags?: ReportTag[]
  readonly companyCountries?: string[]
  readonly siretSirenList?: string[]
  readonly status?: string[]
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

export const reportFilter2QueryString = (report: ReportSearch): ReportFilterQuerystring => {
  try {
    const {hasCompany, hasForeignCountry, hasWebsite, hasPhone, start, end, ...r} = report
    const parseBoolean = (_: keyof Pick<ReportSearch, 'hasForeignCountry' | 'hasWebsite' | 'hasPhone' | 'hasCompany'>) =>
      report[_] !== undefined && {[_]: ('' + report[_]) as 'true' | 'false'}
    const parseDate = (_: keyof Pick<ReportSearch, 'start' | 'end'>) => (report[_] ? {[_]: dateToApiTime(report[_])} : {})
    return {
      ...r,
      ...parseBoolean('hasCompany'),
      ...parseBoolean('hasWebsite'),
      ...parseBoolean('hasPhone'),
      ...parseBoolean('hasForeignCountry'),
      ...parseDate('start'),
      ...parseDate('end'),
    }
  } catch (e) {
    ApiSdkLogger.error('Caught error on "reportFilter2QueryString"', report, e)
    return {}
  }
}

export const cleanReportFilter = (filter: ReportSearch): ReportSearch => {
  if (filter.hasCompany === false) {
    delete filter.siretSirenList
  }
  if (filter.hasForeignCountry === false) {
    delete filter.companyCountries
  }
  if (filter.hasWebsite === false) {
    delete filter.websiteURL
  }
  if (filter.hasPhone === false) {
    delete filter.phone
  }
  return filter
}

export class ReportsClient {
  constructor(private client: ApiClientApi) {}

  readonly extract = (filters: ReportSearch & PaginatedFilters) => {
    return this.client.post<void>(`reports/extract`, {
      qs: cleanObject({
        ...reportFilter2QueryString(cleanReportFilter(filters)),
        ...paginateFilters2QueryString(filters),
        zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    })
  }

  readonly search = (filters: ReportSearch & PaginatedFilters) => {
    const qs = cleanObject(reportFilter2QueryString(cleanReportFilter(filters)))
    return this.client.get<PaginatedData<ReportSearchResult>>(`/reports`, {qs}).then(result => {
      result.entities.forEach(entity => {
        entity.report = ReportsClient.mapReport(entity.report)
      })
      return result
    })
  }

  readonly download = (ids: Id[]) => {
    // TODO Type it and maybe improve it
    return this.client.getPdf<any>(`/reports/download`, {qs: {ids}}).then(directDownloadBlob('Signalement.pdf'))
  }

  readonly saveFilters = (filters: NamedReportSearch) => {
    return this.client.post<void>(`/user-reports-filters`, {body: {name: filters.name, filters: filters.reportSearch}})
  }

  readonly getSavedFilters = (name: String): Promise<ReportSearch> => {
    return this.client.get<ReportSearch>(`/user-reports-filters/${name}`).then(_ => ReportsClient.mapFilters(_))
  }

  readonly listSavedFilters = (): Promise<NamedReportSearch[]> => {
    return this.client
      .get(`/user-reports-filters`)
      .then(_ =>
        _.map((result: any) => ({
          name: result.name,
          reportSearch: ReportsClient.mapFilters(result.filters),
          default: result.default,
        })),
      )
  }

  readonly deleteSavedFilters = (name: String): Promise<void> => {
    return this.client.delete<void>(`/user-reports-filters/${name}`)
  }

  readonly renameSavedFilters = (oldName: String, newName: String): Promise<void> => {
    return this.client.put<void>(`/user-reports-filters/rename/${oldName}/${newName}`)
  }

  readonly setDefaultFilters = (name: String): Promise<void> => {
    return this.client.put<void>(`/user-reports-filters/default/${name}`)
  }

  readonly unsetDefaultFilters = (name: String): Promise<void> => {
    return this.client.delete<void>(`/user-reports-filters/default/${name}`)
  }

  readonly remove = (id: Id) => {
    return this.client.delete<void>(`reports/${id}`)
  }

  readonly getById = (id: Id): Promise<ReportSearchResult> => {
    return this.client.get(`/reports/${id}`).then(_ => ({files: _.files, report: ReportsClient.mapReport(_.report)}))
  }

  readonly getReviewOnReportResponse = (reportId: Id) => {
    return this.client.get<ResponseConsumerReview>(`/reports/${reportId}/response/review`)
  }

  readonly getCloudWord = (companyId: Id) => {
    return this.client.get<ReportWordCount[]>(`/reports/cloudword/${companyId}`)
  }

  readonly postResponse = (id: Id, response: ReportResponse) => {
    return this.client.post<Event>(`reports/${id}/response`, {body: {...response, fileIds: response.fileIds ?? []}})
  }

  readonly postAction = (id: Id, action: ReportAction) => {
    // const mappedAction: any = {...action, actionType: {value: action.actionType}}
    return this.client.post<Event>(`reports/${id}/action`, {body: action})
  }

  readonly updateReportCompany = (reportId: string, company: CompanySearchResult) => {
    return this.client.post<Report>(`/reports/${reportId}/company`, {
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
  }

  readonly updateReportConsumer = (reportId: string, reportConsumerUpdate: ReportConsumerUpdate) => {
    return this.client
      .post(`reports/${reportId}/consumer`, {
        body: reportConsumerUpdate,
      })
      .then(report => ReportsClient.mapReport(report))
  }

  readonly getCountByDepartments = ({start, end}: {start?: Date; end?: Date} = {}): Promise<[string, number][]> => {
    return this.client.get(`/reports/count-by-departments`, {
      qs: {
        start: dateToApiDate(start),
        end: dateToApiDate(end),
      },
    })
  }

  static readonly mapFilters = (filters: ReportSearch): ReportSearch => ({
    ...filters,
    start: filters.start && new Date(filters.start),
    end: filters.end && new Date(filters.end),
  })

  static readonly mapReport = (report: {[key in keyof Report]: any}): Report => ({
    ...report,
    companyAddress: ReportsClient.mapAddress(report.companyAddress),
    creationDate: new Date(report.creationDate),
    expirationDate: new Date(report.expirationDate),
  })

  static readonly mapAddress = (address: {[key in keyof Address]: any | undefined}): Address => ({
    ...address,
    country: address.country?.name,
  })
}
