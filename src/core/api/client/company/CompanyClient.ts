import {ApiClientApi, ApiPaginate, CompanySearch, CompanyWithReportsCount, dateToApi, extractApiAddress} from '../../index'
import {Company, CompanyCreation, CompanyUpdate, Event, Id} from '../../model'

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
    return this.client.post<Event>(`/companies/${siret}/undelivered-document`,
      {body: {returnedDate: dateToApi(returnedDate)},})
  };

  readonly create = (company: CompanyCreation) => {
    return this.client.post<Company>(`/companies`, {body: company});
  };
}
