import {ApiClientApi, dateToApi} from '../../index'
import {Company, CompanyCreation, CompanyUpdate, Event, Id} from '../../model'

export class CompanyClient {

  constructor(private client: ApiClientApi) {
  }

  readonly searchRegisterCompanies = (search: string) => {
    return this.client.get<Company[]>(`/companies/search/registered`, {qs: {q: search,}})
  }

  readonly updateCompanyAddress = (id: Id, update: CompanyUpdate) => {
    return this.client.put<Company>(`/companies/${id}/address`, {body: update});
  };

  readonly saveUndeliveredDocument = (siret: string, returnedDate: Date) => {
    return this.client.post<Event>(`/companies/${siret}/undelivered-document`,
      {body: {returnedDate: dateToApi(returnedDate)},})
  };

  readonly create = (company: CompanyCreation) => {
    return this.client.post<Company>(`/companies`, {body: company});
  };
}
