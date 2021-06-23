import {ApiClientApi, ApiPaginate, CompanySearch, CompanyWithReportsCount, dateToApi, extractApiAddress} from '../../index'
import {Company, CompanyCreation, CompanyUpdate, Event, Id} from '../../model'

interface ApiCompany {
  companyAddress: string
  companyName: string
  companyPostalCode: string
  companySiret: string
  count: number
}

export class CompanyClient {

  constructor(private client: ApiClientApi) {
  }

  readonly search = (search: CompanySearch): Promise<ApiPaginate<CompanyWithReportsCount>> => {
    return this.client.get<ApiPaginate<ApiCompany>>(`/nbReportsGroupByCompany`, {qs: search}).then(res => ({
      ...res,
      entities: res.entities.map(_ => ({
        ..._,
        address: extractApiAddress(_.companyAddress),
        name: _.companyName,
        postalCode: _.companyPostalCode,
        siret: _.companySiret,
      }))
    }))
  }

  readonly searchRegisterCompanies = (search: string) => {
    return this.client.get<Company[]>(`/companies/search/registered`, {qs: {q: search,}})
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
