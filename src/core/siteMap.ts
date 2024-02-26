import {mapDatesToQueryString} from './helper/useQueryString'
import {toQueryString} from './helper'
import {ReportSearch} from './client/report/ReportSearch'
import {Id} from './model'

export const siteMap = {
  logged: {
    tools: '/tools',
    testTools: `/tools/test`,
    adminTools: `/tools/admin`,
    reportedWebsites: `/moderation-url-entreprises`,
    reportedWebsites_unknown: `/moderation-url-entreprises/sites-internet/non-identifies`,
    websitesInvestigation: `/moderation-url-entreprises/enquete`,
    reportedPhone: `/suivi-des-telephones`,
    reports: {
      open: (_?: Partial<ReportSearch>) => `/suivi-des-signalements/ouverts` + (_ ? toQueryString(mapDatesToQueryString(_)) : ``),
      closed: (_?: Partial<ReportSearch>) =>
        `/suivi-des-signalements/clotures` + (_ ? toQueryString(mapDatesToQueryString(_)) : ``),
    },
    subscriptions: `/abonnements`,
    report: (id: Id = `:id`) => `/suivi-des-signalements/report/${id}`,
    ClosedReports: (_?: Partial<ReportSearch>) => '/signalements-clotures' + (_ ? toQueryString(mapDatesToQueryString(_)) : ``),
    exports: `/mes-telechargements`,
    companies_toActivate: `/entreprises/a-activer`,
    companies_toFollowUp: `/entreprises/a-relancer`,
    companies_registered: `/entreprises/les-plus-signalees`,
    companies: `/entreprises`,
    companiesPro: `/mes-entreprises`,
    joinInformation: `/information`,
    companyAccesses: (siret: string = `:siret`) => `/entreprise/acces/${siret}`,
    users: `/users`,
    company: (id: Id) => `/bilan-entreprise/${id}`,
    users_agent_pending: `/users/pending`,
    users_consumer_validation: `/users/consumers`,
    users_auth_attempts: (email?: string) => `/users/auth-attempts` + (email ? toQueryString({email}) : ``),
    users_blacklist: `/users/blacklist`,
    users_agent: `/users/agent`,
    users_admin: `/users/admin`,
    updateEmail: (token: string) => `/parametres/update-email/${token}`,
    settings: `/parametres`,
    modeEmploiDGCCRF: `/mode-emploi-dgccrf`,
    stats: `/stats`,
    proStats: `/stats/pro-stats`,
    dgccrfStats: `/stats/dgccrf-stats`,
    reportStats: `/stats/report-stats`,
    countBySubCategories: `/stats/countBySubCategories`,
  },
  loggedout: {
    welcome: '/',
    activatePro: (siret: string = `:siret`) => `/entreprise/rejoindre/${siret}`,
    activateAgent: `/agent/rejoindre`,
    activateAdmin: `/admin/rejoindre`,
    consumerReview: (reportId: Id = `:reportId`) => `/suivi-des-signalements/${reportId}/avis`,
    register: `/activation`,
    login: `/connexion`,
    emailValidation: `/connexion/validation-email`,
    resetPassword: (token: Id = `:token`) => `/connexion/nouveau-mot-de-passe/${token}`,
  },
}
