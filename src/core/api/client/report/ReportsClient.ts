import {ApiClientApi, cleanObject, dateToApi, directDownloadBlob, Event, Id, Report, ReportAction, ReportResponse, ReportSearchResult} from '../../index'
import {PaginatedData, ReportSearch} from '../../model'
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

const reportFilter2QueryString = (report: ReportSearch): ReportFilterQuerystring => {
  try {
    const {offset, limit, hasCompany, websiteExists, phoneExists, companyCountries, departments, start, end, ...r} = report

    const parseBoolean = (_: keyof Pick<ReportSearch, 'websiteExists' | 'phoneExists' | 'hasCompany'>) => (report[_] !== undefined && {[_]: '' + report[_] as 'true' | 'false'})
    const parseDate = (_: keyof Pick<ReportSearch, 'start' | 'end'>) => ((report[_]) ? {[_]: dateToApi(report[_])} : {})
    const parseArray = (_: keyof Pick<ReportSearch, 'companyCountries' | 'departments'>) => (report[_] ? {[_]: [report[_]]?.flatMap(_ => _).join(',')} : {})
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

const cleanReportFilter = (filter: ReportSearch): ReportSearch => {
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

export const reportFilter2Body = (report: ReportSearch): { [key in keyof ReportSearch]: any } => {
  const { start, end, offset, departments, tags, limit, siretSirenList, ...rest } = report;
  return {
    ...rest,
    limit: undefined,
    offset: undefined,
    siretSirenList: Array.isArray(siretSirenList) ? siretSirenList : (siretSirenList !== undefined ? [siretSirenList] : undefined),
    departments: departments || [],
    tags: tags || [],
    start: dateToApi(start),
    end: dateToApi(end)
  };
};

export class ReportsClient {

  constructor(private client: ApiClientApi) {
  }

  readonly extract = (filter: ReportSearch = {offset: 0, limit: 10}) => {
    const body = pipe(cleanReportFilter, reportFilter2Body, cleanObject)(filter)
    return this.client.post<void>(`reports/extract`, {body})
  }

  readonly search = (filter: ReportSearch = {offset: 0, limit: 10}) => {
    return Promise.resolve({
      'totalCount': 5,
      'hasNextPage': false,
      'entities': [{
        'report': {
          'id': '967a923a-498b-4235-ad15-f64e28a59cd9',
          'category': 'Eau / Gaz / Electricité',
          'subcategories': ['Autre (Fioul / GPL / granulés de bois...)', 'Non, pas sur internet'],
          'details': [{'label': 'Description :', 'value': 'test'}, {'label': 'Date du constat :', 'value': '29/06/2021'}],
          'companyName': 'ALEXANDRE ANNIC',
          'companyAddress': 'ALEXANDRE ANNIC - 31 RUE EMILE BERNARD - 29930 PONT-AVEN',
          'companyPostalCode': '29930',
          'companySiret': '81352117600038',
          'creationDate': '2021-06-29T12:44:19.031213Z',
          'contactAgreement': true,
          'employeeConsumer': false,
          'status': 'Non consulté',
          'websiteURL': null,
          'host': null,
          'phone': null,
          'vendor': null,
          'tags': ['Litige contractuel'],
          'firstName': 'Alexandre',
          'lastName': 'ANNIC',
          'email': 'alexandre.annic1@gmail.com'
        }, 'files': []
      }, {
        'report': {
          'id': '29b2a1db-a19d-4d14-9561-611fefd740ee',
          'category': 'COVID-19 (coronavirus)',
          'subcategories': ['Problème / abus avec un site de vente en ligne', 'Autre problème de prix'],
          'details': [{'label': 'Date du constat :', 'value': '29/06/2021'}, {'label': 'Quel est le problème :', 'value': 'test'}],
          'companyName': 'ALEXANDRE ANNIC',
          'companyAddress': 'ALEXANDRE ANNIC - 31 RUE EMILE BERNARD - 29930 PONT-AVEN',
          'companyPostalCode': '29930',
          'companySiret': '81352117600038',
          'creationDate': '2021-06-29T10:56:23.346359Z',
          'contactAgreement': false,
          'employeeConsumer': false,
          'status': 'Clôturé',
          'websiteURL': 'https://fake.url.test/',
          'host': 'fake.url.test',
          'phone': null,
          'vendor': null,
          'tags': ['Internet']
        },
        'files': [{
          'id': '5df5051d-b689-4d77-aa94-d7204d61bad1',
          'reportId': '29b2a1db-a19d-4d14-9561-611fefd740ee',
          'creationDate': '2021-06-29T12:43:05.720478Z',
          'filename': '0fa435e0-a518-4e6d-9ed3-719f9a100bbf_IMG_3569 (1).jpg',
          'storageFilename': '3c4f9503-93dc-451e-8000-aea8789e86aa_0fa435e0-a518-4e6d-9ed3-719f9a100bbf_IMG_3569 (1).jpg',
          'origin': 'professional',
          'avOutput': '/tmp/3c4f9503-93dc-451e-8000-aea8789e86aa_0fa435e0-a518-4e6d-9ed3-719f9a100bbf_IMG_3569 (1).jpg: OK----------- SCAN SUMMARY -----------Known viruses: 8542198Engine version: 0.103.2Scanned directories: 0Scanned files: 1Infected files: 0Data scanned: 4.86 MBData read: 2.29 MB (ratio 2.13:1)Time: 26.157 sec (0 m 26 s)Start Date: 2021:06:29 12:43:05End Date:   2021:06:29 12:43:31'
        }]
      }, {
        'report': {
          'id': 'fa101a4a-211d-49ad-8c95-8f291c0985a6',
          'category': 'COVID-19 (coronavirus)',
          'subcategories': ['Problème / abus avec un site de vente en ligne', 'Problème avec un produit livré'],
          'details': [{'label': 'Date du constat :', 'value': '28/04/2021'}, {'label': 'Quel est le problème :', 'value': 'test'}],
          'companyName': 'ALEXANDRE ANNIC',
          'companyAddress': 'ALEXANDRE ANNIC - 31 RUE EMILE BERNARD - 29930 PONT-AVEN',
          'companyPostalCode': '29930',
          'companySiret': '81352117600038',
          'creationDate': '2021-04-28T08:27:27.901921Z',
          'contactAgreement': true,
          'employeeConsumer': false,
          'status': 'Clôturé',
          'websiteURL': 'https://tegea.com',
          'host': 'tegea.com',
          'phone': null,
          'vendor': null,
          'tags': ['Internet'],
          'firstName': 'Alexandre',
          'lastName': 'ANNIC',
          'email': 'alexandre.annic1@gmail.com'
        }, 'files': []
      }, {
        'report': {
          'id': '4c4c6308-d2e1-4a25-8dca-9ac1bbe97c8c',
          'category': 'COVID-19 (coronavirus)',
          'subcategories': ['Les prix (gel désinfectant, masque) sont trop élevés', 'Gel désinfectant (gel hydroalcoolique)', 'Non, pas sur internet'],
          'details': [{'label': 'Date du constat :', 'value': '19/04/2021'}, {
            'label': 'Volume du produit et autres caractéristiques :',
            'value': 'delete me'
          }, {'label': 'Quel est le prix de vente :', 'value': '0'}],
          'companyName': 'ALEXANDRE ANNIC',
          'companyAddress': 'ALEXANDRE ANNIC - 31 RUE EMILE BERNARD - 29930 PONT-AVEN',
          'companyPostalCode': '29930',
          'companySiret': '81352117600038',
          'creationDate': '2021-04-19T17:44:54.944755Z',
          'contactAgreement': false,
          'employeeConsumer': false,
          'status': 'Clôturé',
          'websiteURL': null,
          'host': null,
          'phone': null,
          'vendor': null,
          'tags': []
        }, 'files': []
      }, {
        'report': {
          'id': 'ced31668-7aa4-4925-9378-655e9ea8bf1f',
          'category': 'COVID-19 (coronavirus)',
          'subcategories': ['Problème avec les règles d\'hygiène ou de distanciation physique'],
          'details': [{'label': 'Description :', 'value': 'a'}, {'label': 'Date du constat :', 'value': '19/02/2021'}],
          'companyName': 'ALEXANDRE ANNIC',
          'companyAddress': 'ALEXANDRE ANNIC - 5 RUE JEAN MACE - 92150 SURESNES',
          'companyPostalCode': '92150',
          'companySiret': '81352117600020',
          'creationDate': '2021-02-19T18:26:23.931744Z',
          'contactAgreement': true,
          'employeeConsumer': false,
          'status': 'Clôturé',
          'websiteURL': null,
          'host': null,
          'phone': null,
          'vendor': null,
          'tags': [],
          'firstName': 'Alexandre',
          'lastName': 'ANNIC',
          'email': 'alexandre.annic1@gmail.com'
        }, 'files': []
      }]
    } as unknown as PaginatedData<ReportSearchResult>)
      .then(result => {
        result.entities.forEach(entity => {
          entity.report = ReportsClient.mapReport(entity.report)
        })
        return result
      })
    // return this.client.get<PaginatedData<ReportSearchResult>>(`/reports`, {
    //   qs: pipe(
    //     cleanReportFilter,
    //     reportFilter2QueryString,
    //     cleanObject,
    //   )(filter)
    // }).then(result => {
    //   result.entities.forEach(entity => {
    //     entity.report = ReportsClient.mapReport(entity.report)
    //   })
    //   return result
    // })
  }

  readonly download = (id: Id) => {
    // TODO Type it and maybe improve it
    return this.client.getPdf<any>(`reports/${id}/download`, {headers: {responseType: 'blob', 'Accept': 'application/pdf'}})
      .then(directDownloadBlob('test.pdf'))
  }

  readonly remove = (id: Id) => {
    return this.client.delete<void>(`reports/${id}`)
  }

  readonly getById = (id: Id) => {
    return this.client.get<ReportSearchResult>(`/reports/${id}`).then(_ => ({files: _.files, report: ReportsClient.mapReport(_.report)}))
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
