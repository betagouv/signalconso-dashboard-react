import {
  ApiClientApi,
  ApiPaginate,
  CompanySearch,
  CompanyToActivate,
  CompanyWithAccessLevel,
  CompanyWithReportsCount,
  dateToApi,
  directDownloadBlob,
} from '../..'
import {Company, CompanyCreation, CompanyUpdate, Event, Id} from '../../model'
import {format} from 'date-fns'

export class CompanyClient {
  constructor(private client: ApiClientApi) {}

  readonly search = (search: CompanySearch): Promise<ApiPaginate<CompanyWithReportsCount>> => {
    return this.client.get<ApiPaginate<CompanyWithReportsCount>>(`/companies`, {qs: search}).then(res => ({
      ...res,
      entities: res.entities,
    }))
  }

  readonly updateAddress = (id: Id, update: CompanyUpdate) => {
    return this.client.put<Company>(`/companies/${id}/address`, {body: update})
  }

  readonly saveUndeliveredDocument = (siret: string, returnedDate: Date) => {
    return this.client.post<Event>(`/companies/${siret}/undelivered-document`, {body: {returnedDate: dateToApi(returnedDate)}})
  }

  readonly create = (company: CompanyCreation) => {
    return this.client.post<Company>(`/companies`, {body: company})
  }

  readonly downloadActivationDocument = (companyIds: Id[]) => {
    return this.client
      .postGetPdf(`/companies/activation-document`, {body: {companyIds}})
      .then(directDownloadBlob(`signalement_depot_${format(new Date(), 'ddMMyy')}`))
  }

  readonly getAccessibleByPro = (): Promise<CompanyWithAccessLevel[]> => {
    return this.client
      .get<CompanyWithAccessLevel[]>(`/accesses/connected-user`)
      .then(res => res.map(_ => ({..._, creationDate: new Date(_.creationDate)})))
  }

  readonly getVisibleByPro = () => {
    return this.client.get<Company[]>(`/companies/connected-user`)
  }

  readonly fetchToActivate = () => {
    return this.client.get<CompanyToActivate[]>(`/companies/to-activate`).then(_ =>
      _.map(_ => {
        _.lastNotice = _.lastNotice ? new Date(_.lastNotice) : undefined
        _.tokenCreation = new Date(_.tokenCreation)
        _.company.creationDate = new Date(_.company.creationDate)
        return _
      }),
    )
  }

  readonly confirmCompaniesPosted = (companyIds: Id[]) => {
    return this.client.post<void>(`/companies/companies-posted`, {body: {companyIds}})
  }
}
