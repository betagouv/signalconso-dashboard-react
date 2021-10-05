import {Id, ReportSearch, toQueryString} from '@betagouv/signalconso-api-sdk-js'

export const siteMap = {
  reportedWebsites: '/moderation-url-entreprises',
  reportedCompanyWebsites: '/moderation-url-entreprises/site-internet',
  reportedWebsites_unknown: '/moderation-url-entreprises/sites-internet/non-identifies',
  reportedPhone: '/suivi-des-telephones',
  reports: (_?: Partial<ReportSearch>) => '/suivi-des-signalements' + (_ ? toQueryString(_) : ''),
  subscriptions: '/abonnements',
  report: (id: Id = ':id') => `/suivi-des-signalements/report/${id}`,
  exports: '/mes-telechargements',
  companies_toActivate: '/entreprises/a-activer',
  companies_registered: '/entreprises/les-plus-signalees',
  companies: '/entreprises',
  companiesPro: '/mes-entreprises',
  companyAccesses: (siret: string = ':siret') => `/entreprise/acces/${siret}`,
  users: '/admin/invitation-ccrf',
  activatePro: (siret: string = ':siret') => `/entreprise/rejoindre/${siret}`,
  company: (id: Id = ':id') => `/bilan-entreprise/${id}`,
  activateDgccrf: '/dgccrf/rejoindre',
  users_pending: '/admin/invitation-ccrf/pending',
  users_all: '/admin/invitation-ccrf/all',
  settings: '/parametres',
  register: '/activation',
  registerBis: '/entreprise/activation',
  login: '/connexion',
  emailValidation: '/connexion/validation-email',
  modeEmploiDGCCRF: '/mode-emploi-dgccrf',
  consumerReview: (reportId: Id = ':reportId') => `/suivi-des-signalements/${reportId}/avis`,
  resetPassword: (token: Id = ':token') => `/connexion/nouveau-mot-de-passe/${token}`,
  companiesDbSync: `/companies-db-sync`
}
