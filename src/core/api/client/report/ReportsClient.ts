import {ApiClientApi, cleanObject, dateToApi, Id, Report, ReportSearchResult} from '../../index'
import {PaginatedData, ReportFilter} from '../../model'
import {pipe} from 'rxjs'
import {ApiSdkLogger} from '../../helper/Logger'

export interface ReportFilterQuerystring {
  readonly departments?: string;
  readonly tags?: string | string[];
  readonly companyCountries?: string;
  readonly siretSirenList?: string[];
  start?: string;
  end?: string;
  email?: string;
  websiteURL?: string;
  phone?: string;
  websiteExists?: 'true' | 'false';
  phoneExists?: 'true' | 'false';
  category?: string;
  status?: string;
  details?: string;
  hasCompany?: 'true' | 'false';
  offset?: string;
  limit?: string;
}

const reportFilter2QueryString = (report: ReportFilter): ReportFilterQuerystring => {
  try {
    const {offset, limit, hasCompany, websiteExists, phoneExists, companyCountries, departments, start, end, ...r} = report

    const parseBoolean = (_: keyof Pick<ReportFilter, 'websiteExists' | 'phoneExists' | 'hasCompany'>) => (report[_] !== undefined && {[_]: '' + report[_] as 'true' | 'false'})
    const parseDate = (_: keyof Pick<ReportFilter, 'start' | 'end'>) => ((report[_]) ? {[_]: dateToApi(report[_])} : {})
    const parseArray = (_: keyof Pick<ReportFilter, 'companyCountries' | 'departments'>) => (report[_] ? {[_]: report[_]?.join(',')} : {})
    return {
      ...r,
      // email: fromNullable(report.email).map(encodeURI).toUndefined(),
      // websiteURL: fromNullable(report.websiteURL).map(encodeURI).toUndefined(),
      // phone: fromNullable(report.phone).map(encodeURI).toUndefined(),
      // category: fromNullable(report.category).map(encodeURI).toUndefined(),
      // status: fromNullable(report.status).map(encodeURI).toUndefined(),
      // details: fromNullable(report.details).map(encodeURI).toUndefined(),
      offset: offset !== undefined ? offset + '' : undefined,
      limit: limit !== undefined ? limit + '' : undefined,
      ...parseBoolean('hasCompany'),
      ...parseBoolean('websiteExists'),
      ...parseBoolean('phoneExists'),
      ...parseArray('companyCountries'),
      ...parseArray('departments'),
      ...parseDate('start'),
      ...parseDate('end'),
    }
  } catch (e) {
    ApiSdkLogger.error('Caught error on "reportFilter2QueryString"', report, e)
    return {}
  }
}

const cleanReportFilter = (filter: ReportFilter): ReportFilter => {
  if (filter.websiteExists === false) {
    delete filter.websiteExists
    delete filter.websiteURL
  }
  if (filter.phoneExists === false) {
    delete filter.phoneExists
    delete filter.phone
  }
  return filter
}

export class ReportsClient {

  constructor(private client: ApiClientApi) {
  }

  readonly search = (filter: ReportFilter = {offset: 0, limit: 10}) => {
    return this.client.get<PaginatedData<ReportSearchResult>>(`/reports`, {
      qs: pipe(
        cleanReportFilter,
        reportFilter2QueryString,
        cleanObject,
      )(filter)
    }).then(result => {
      result.entities.forEach(entity => {
        entity.report = ReportsClient.mapReport(entity.report)
      })
      return result
    })
  }

  readonly encode = (reportFilter: ReportFilter) => {

  }
  readonly getById = (id: Id) => {
    return this.client.get<ReportSearchResult>(`/reports/${id}`)
  }

  static readonly mapReport = (report: { [key in keyof Report]: any }): Report => ({
    ...report,
    creationDate: new Date(report.creationDate),
  })
}
