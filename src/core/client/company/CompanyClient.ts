import { format } from 'date-fns'
import { directDownloadBlob } from '../../helper'
import {
  CompaniesToImport,
  Company,
  CompanyCreation,
  CompanyHosts,
  CompanySearch,
  CompanyToActivate,
  CompanyToFollowUp,
  CompanyUpdate,
  CompanyWithAccessLevel,
  CompanyWithReportsCount,
  Id,
  Paginate,
} from '../../model'
import { ApiClient } from '../ApiClient'
import { AlbertProblemsResult } from '../albert/AlbertProblemsResult'

export class CompanyClient {
  constructor(private client: ApiClient) {}

  readonly search = (
    search: CompanySearch,
  ): Promise<Paginate<CompanyWithReportsCount>> => {
    return this.client
      .get<Paginate<CompanyRawFromApi>>(`/companies`, { qs: search })
      .then((res) => ({
        ...res,
        entities: res.entities.map(CompanyClient.mapCompany),
      }))
  }

  readonly byId = (id: Id): Promise<Paginate<CompanyWithReportsCount>> => {
    return this.client
      .get<Paginate<CompanyRawFromApi>>(`/companies/${id}`)
      .then((res) => ({
        ...res,
        entities: res.entities.map(CompanyClient.mapCompany),
      }))
  }

  readonly updateAddress = (id: Id, update: CompanyUpdate) => {
    return this.client.put<Company>(`/companies/${id}/address`, {
      body: update,
    })
  }

  readonly getResponseRate = (id: Id) => {
    return this.client.get<number>(`/companies/${id}/response-rate`)
  }

  readonly create = (company: CompanyCreation) => {
    return this.client.post<Company>(`/companies`, { body: company })
  }

  readonly importCompanies = (companiesToImport: CompaniesToImport) => {
    return this.client.post(`/import/companies`, { body: companiesToImport })
  }

  readonly downloadActivationDocument = (companyIds: Id[]) => {
    return this.client
      .postGetPdf(`/companies/activation-document`, { body: { companyIds } })
      .then(
        directDownloadBlob(
          `signalement_depot_${format(new Date(), 'ddMMyy')}`,
          'application/pdf',
        ),
      )
  }

  readonly downloadFollowUpDocument = (companyIds: Id[]) => {
    return this.client
      .postGetPdf(`/companies/follow-up-document `, { body: { companyIds } })
      .then(
        directDownloadBlob(
          `signalement_relance_${format(new Date(), 'ddMMyy')}`,
          'application/pdf',
        ),
      )
  }

  readonly getHosts = async (id: Id): Promise<CompanyHosts> => {
    const tuples = await this.client.get<[string, number][]>(
      `/companies/hosts/${id}`,
    )
    return tuples.map(([host, nbOccurences]) => ({
      host,
      nbOccurences,
    }))
  }

  readonly getAccessibleByPro = () => {
    return this.client.get<CompanyWithAccessLevel[]>(
      `/companies/connected-user`,
    )
  }

  readonly fetchToActivate = () => {
    return this.client
      .get<CompanyToActivate[]>(`/companies/to-activate`)
      .then((_) =>
        _.map((_) => {
          _.lastNotice = _.lastNotice ? new Date(_.lastNotice) : undefined
          _.tokenCreation = new Date(_.tokenCreation)
          _.company.creationDate = new Date(_.company.creationDate)
          return _
        }),
      )
  }

  readonly fetchToFollowUp = () => {
    return this.client.get<CompanyToFollowUp[]>(`/companies/inactive-companies`)
  }

  readonly confirmCompaniesPosted = (ids: Id[]) => {
    return this.client.post<void>(`/companies/companies-posted`, {
      body: { companyIds: ids },
    })
  }

  readonly confirmCompaniesFollowedUp = (ids: Id[]) => {
    return this.client.post<void>(`/companies/follow-up-posted`, {
      body: { companyIds: ids },
    })
  }

  readonly getProblemsSeenByAlbert = async (id: string) => {
    return this.client.get<AlbertProblemsResult | null>(
      `/companies/${id}/albert-problems`,
    )
  }

  private static readonly mapCompany = (
    company: CompanyRawFromApi,
  ): CompanyWithReportsCount => {
    return {
      ...company,
      creationDate: new Date(company.creationDate),
    }
  }
}

type CompanyRawFromApi = Omit<CompanyWithReportsCount, 'creationDate'> & {
  creationDate: string
}
