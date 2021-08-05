import {ApiClientApi, ApiPaginate, CompanySearch, CompanyToActivate, CompanyWithAccessLevel, CompanyWithReportsCount, dateToApi, directDownloadBlob, VisibleCompany} from '../..'
import {Company, CompanyCreation, CompanyUpdate, Event, Id} from '../../model'
import {format} from 'date-fns'
import {Address} from '../../model/Address'

interface ApiCompanyWithReportsCount {
  companyAddress: Address
  companyName: string
  companySiret: string
  count: number
}

export class CompanyClient {

  constructor(private client: ApiClientApi) {
  }

  private static readonly mapCompanyWithReportsCount = (_: ApiCompanyWithReportsCount): CompanyWithReportsCount => ({
    ..._,
    address: _.companyAddress,
    name: _.companyName,
    siret: _.companySiret,
  })

  readonly search = (search: CompanySearch): Promise<ApiPaginate<CompanyWithReportsCount>> => {
    return this.client.get<ApiPaginate<ApiCompanyWithReportsCount>>(`/companies`, {qs: search}).then(res => ({
      ...res,
      entities: res.entities.map(CompanyClient.mapCompanyWithReportsCount)
    }))
  }

  /** @deprecated use search() instead */
  readonly searchRegisterCompanies = (search: string): Promise<CompanyWithReportsCount[]> => {
    return this.client.get<ApiCompanyWithReportsCount[]>(`/companies/search/registered`, {qs: {q: search,}}).then(_ => _.map(CompanyClient.mapCompanyWithReportsCount))
  }

  readonly updateCompanyAddress = (id: Id, update: CompanyUpdate) => {
    return this.client.put<Company>(`/companies/${id}/address`, {body: update})
  }

  readonly saveUndeliveredDocument = (siret: string, returnedDate: Date) => {
    return this.client.post<Event>(`/companies/${siret}/undelivered-document`, {body: {returnedDate: dateToApi(returnedDate)},})
  }

  readonly create = (company: CompanyCreation) => {
    return this.client.post<Company>(`/companies`, {body: company})
  }

  readonly downloadActivationDocument = (companyIds: Id[]) => {
    return this.client.postGetPdf(`/companies/activation-document`, {body: {companyIds}})
      .then(directDownloadBlob(`signalement_depot_${format(new Date(), 'ddMMyy')}`))
  }

  readonly getCompaniesAccessibleByPro = (): Promise<CompanyWithAccessLevel[]> => {
    // return this.client.get<CompanyWithAccessLevel[]>(`/accesses/connected-user`)
    return Promise.resolve([{
      'id': 'db146dca-e087-4f82-af8f-e4c9e6a8b60f',
      'siret': '81352117600038',
      'creationDate': '2021-04-08T07:38:29.371639Z',
      'name': 'ALEXANDRE ANNIC',
      'address': {'number': '31', 'street': 'RUE EMILE BERNARD', 'addressSupplement': 'More', 'postalCode': '29930', 'city': 'PONT-AVEN'},
      'activityCode': '62.02A',
      'level': 'admin' as any,
    },
    //   {
    //   'id': 'b1a01fc4-34f8-453e-87e7-b89bf76f5267',
    //   'siret': '81352117600020',
    //   'creationDate': '2021-02-19T18:26:23.920244Z',
    //   'name': 'ALEXANDRE ANNIC',
    //   'address': {'number': '5', 'street': 'RUE JEAN MACE', 'addressSupplement': '', 'postalCode': '92150', 'city': 'SURESNES'},
    //   'activityCode': '62.02A',
    //   'level': 'admin' as any,
    // }
    ]).then(res => res.map(_ => ({..._, creationDate: new Date(_.creationDate)})))
  }

  readonly getCompaniesVisibleByPro = (): Promise<VisibleCompany[]> => {
    // return this.client.get<ViewableCompany[]>(`/companies/connected-user`)
    return Promise.resolve([{'siret': '81352117600038', 'postalCode': '29930', 'closed': false}, {'siret': '81352117600020', 'postalCode': '92150', 'closed': true}])
  }

  readonly fetchToActivate = () => {
    return this.client.get<CompanyToActivate[]>(`/companies/to-activate`).then(_ => _.map(_ => {
      _.lastNotice = _.lastNotice ? new Date(_.lastNotice) : undefined
      _.tokenCreation = new Date(_.tokenCreation)
      _.company.creationDate = new Date(_.company.creationDate)
      return _
    }))
  }

  readonly confirmCompaniesPosted = (companyIds: Id[]) => {
    return this.client.post<void>(`/companies/companies-posted`, {body: {companyIds}})
  }
}
