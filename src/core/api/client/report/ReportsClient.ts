import {ApiClientApi, cleanObject, dateToApi, Event, Id, Report, ReportAction, ReportResponse, ReportSearchResult} from '../../index'
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

  readonly download = (id: Id) => {
    // TODO Type it and maybe improve it
    return this.client.get<any>(`reports/${id}/download`,
      {headers: {responseType: 'blob', 'Accept': 'application/pdf'}}
    )
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'file.pdf')
        document.body.appendChild(link)
        link.click()
      })
  }

  readonly remove = (id: Id) => {
    return this.client.delete<void>(`reports/${id}`)
  }

  readonly getById = (id: Id) => {
    return this.client.get<ReportSearchResult>(`/reports/${id}`)
  }

  readonly postReportResponse = (id: Id, response: ReportResponse) => {
    return this.client.post<Event>(`reports/${id}/response`, {body: response})
  }

  readonly postReportAction = (id: Id, action: ReportAction) => {
    const mappedAction: any = {...action, actionType: {value: action.actionType}}
    return this.client.post<Event>(`reports/${id}/response`, {body: mappedAction})
  }

  static readonly mapReport = (report: { [key in keyof Report]: any }): Report => ({
    ...report,
    creationDate: new Date(report.creationDate),
  })
}
