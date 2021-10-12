import {Id, ReportSearch, Roles, toQueryString} from '@signal-conso/signalconso-api-sdk-js'

export const siteMap = {
  logged: (_role: Roles | null) => {
    const role = _role?.toLocaleLowerCase() || ':role'
    return {
      reportedWebsites: `/${role}/moderation-url-entreprises`,
      reportedWebsites_unknown: `/${role}/moderation-url-entreprises/sites-internet/non-identifies`,
      reportedWebsites_association: `/${role}/moderation-url-entreprises/site-internet`,
      reportedPhone: `/${role}/suivi-des-telephones`,
      reports: (_?: Partial<ReportSearch>) => `/${role}/suivi-des-signalements` + (_ ? toQueryString(_) : ``),
      subscriptions: `/${role}/abonnements`,
      report: (id: Id = `:id`) => `/${role}/suivi-des-signalements/report/${id}`,
      exports: `/${role}/mes-telechargements`,
      companies_toActivate: `/${role}/entreprises/a-activer`,
      companies_registered: `/${role}/entreprises/les-plus-signalees`,
      companies: `/${role}/entreprises`,
      companiesPro: `/${role}/mes-entreprises`,
      companyAccesses: (siret: string = `:siret`) => `/${role}/entreprise/acces/${siret}`,
      users: `/${role}/admin/invitation-ccrf`,
      company: (id: Id = `:id`) => `/${role}/bilan-entreprise/${id}`,
      users_pending: `/${role}/admin/invitation-ccrf/pending`,
      users_all: `/${role}/admin/invitation-ccrf/all`,
      settings: `/${role}/parametres`,
      modeEmploiDGCCRF: `/${role}/mode-emploi-dgccrf`,
      companiesDbSync: `/${role}/companies-db-sync`,
    }
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
