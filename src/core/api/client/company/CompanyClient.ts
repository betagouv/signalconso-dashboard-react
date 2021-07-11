import {
  ApiClientApi,
  ApiPaginate,
  CompanyAccessLevel,
  CompanySearch,
  CompanyToActivate,
  CompanyWithReportsCount,
  dateToApi,
  directDownloadBlob,
  extractApiAddress, ViewableCompany
} from '../../index'
import {Company, CompanyCreation, CompanyUpdate, Event, Id} from '../../model'
import {format} from 'date-fns'

interface ApiCompanyWithReportsCount {
  companyAddress: string
  companyName: string
  companyPostalCode: string
  companySiret: string
  count: number
}

export class CompanyClient {

  constructor(private client: ApiClientApi) {
  }

  private static readonly mapCompanyWithReportsCount = (_: ApiCompanyWithReportsCount): CompanyWithReportsCount => ({
    ..._,
    address: extractApiAddress(_.companyAddress),
    name: _.companyName,
    postalCode: _.companyPostalCode,
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
    return this.client.postGetPdf(`/companies/activation-document`, {body: {companyIds},})
      .then(directDownloadBlob(`signalement_depot_${format(new Date(), 'ddMMyy')}`))
  }

  readonly getAccessesByPro = () => {
    return this.client.get<CompanyAccessLevel[]>(`/accesses/connected-user`)
  }

  readonly getCompaniesViewableByPro = () => {
    return this.client.get<ViewableCompany[]>(`/accesses/connected-user`)
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
