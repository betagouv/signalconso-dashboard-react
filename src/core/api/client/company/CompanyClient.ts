import {
    ApiClientApi,
    ApiPaginate,
    CompanySearch,
    CompanyToActivate,
    CompanyWithAccessLevel, CompanyWithNotification,
    CompanyWithReportsCount,
    dateToApi,
    directDownloadBlob, PaginatedData,
    VisibleCompany,
} from '../..'
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
        return this.client.get<ApiPaginate<ApiCompanyWithReportsCount>>(`/companies`, {qs: search})
            .then(res => ({
                ...res,
                entities: res.entities.map(CompanyClient.mapCompanyWithReportsCount),
            }))
    }

    readonly blockCompanyNotification = (companyId: Id) => {
        return this.client.post(`/report-notification-blocklist/${companyId}`)
    }

    readonly allowCompanyNotification = (companyId: Id) => {
        return this.client.delete(`/report-notification-blocklist/${companyId}`)
    }

    readonly accessibleCompanyProWithNotificationBlocklist = (): Promise<CompanyWithNotification[]> => {

        const companiesForProUser = this.client
            .get<CompanyWithAccessLevel[]>(`/accesses/connected-user`)
            .then(res => res.map(_ => ({..._, creationDate: new Date(_.creationDate)})))

        const blockedNotification: Promise<Id[]> = this.client.get(`/report-notification-blocklist`)

        return companiesForProUser
            .then(companies => blockedNotification.then(blocked => ({blocked: blocked, companies: companies})))
            .then(_ => _.companies.map(c => _.blocked.filter(id => id === c.id).length >= 1 ?
                ({
                    ...c,
                    hasNotification: false
                }) : ({...c, hasNotification: true})))

    }

    /** @deprecated use search() instead */
    readonly searchRegisterCompanies = (search: string): Promise<CompanyWithReportsCount[]> => {
        return this.client
            .get<ApiCompanyWithReportsCount[]>(`/companies/search/registered`, {qs: {q: search}})
            .then(_ => _.map(CompanyClient.mapCompanyWithReportsCount))
    }

    readonly updateCompanyAddress = (id: Id, update: CompanyUpdate) => {
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

    readonly getCompaniesAccessibleByPro = (): Promise<CompanyWithAccessLevel[]> => {
        return this.client
            .get<CompanyWithAccessLevel[]>(`/accesses/connected-user`)
            .then(res => res.map(_ => ({..._, creationDate: new Date(_.creationDate)})))
    }


    readonly getCompaniesVisibleByPro = (): Promise<VisibleCompany[]> => {
        return this.client.get<VisibleCompany[]>(`/companies/connected-user`)
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
