import {Id, ReportSearch, toQueryString} from '@signal-conso/signalconso-api-sdk-js'
import {mapDateFromQueryString, mapDatesToQueryString} from './helper/useQueryString'

export const siteMap = {
  logged: {
    reportedWebsites: `/moderation-url-entreprises`,
    reportedWebsites_unknown: `/moderation-url-entreprises/sites-internet/non-identifies`,
    reportedWebsites_association: `/moderation-url-entreprises/site-internet`,
    reportedPhone: `/suivi-des-telephones`,
    reports: (_?: Partial<ReportSearch>) => `/suivi-des-signalements` + (_ ? toQueryString(mapDatesToQueryString(_)) : ``),
    subscriptions: `/abonnements`,
    report: (id: Id = `:id`) => `/suivi-des-signalements/report/${id}`,
    exports: `/mes-telechargements`,
    companies_toActivate: `/entreprises/a-activer`,
    companies_registered: `/entreprises/les-plus-signalees`,
    companies: `/entreprises`,
    companiesPro: `/mes-entreprises`,
    companyAccesses: (siret: string = `:siret`) => `/entreprise/acces/${siret}`,
    users: `/admin/invitation-ccrf`,
    company: (id: Id = `:id`) => `/bilan-entreprise/${id}`,
    users_pending: `/admin/invitation-ccrf/pending`,
    users_all: `/admin/invitation-ccrf/all`,
    settings: `/parametres`,
    modeEmploiDGCCRF: `/mode-emploi-dgccrf`,
    companiesDbSync: `/companies-db-sync`,
    stats: `/stats`,
  },
  loggedout: {
    activatePro: (siret: string = `:siret`) => `/entreprise/rejoindre/${siret}`,
    activateDgccrf: `/dgccrf/rejoindre`,
    consumerReview: (reportId: Id = `:reportId`) => `/suivi-des-signalements/${reportId}/avis`,
    register: `/activation`,
    registerBis: `/entreprise/activation`,
    login: `/connexion`,
    emailValidation: `/connexion/validation-email`,
    resetPassword: (token: Id = `:token`) => `/connexion/nouveau-mot-de-passe/${token}`,
  },
}
