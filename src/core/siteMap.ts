import {Id, ReportSearch} from './api/model'
import {toQueryString} from './api'

export const siteMap = {
  reportedWebsites: '/moderation-url-entreprises',
  reportedPhone: '/suivi-des-telephones',
  reports: (_?: Partial<ReportSearch>) => '/reports' + (_ ? toQueryString(_) : ''),
  reportsPro: (_?: Partial<ReportSearch>) => '/suivi-des-signalements/pro' + (_ ? toQueryString(_) : ''),
  subscriptions: '/abonnements',
  report: (id: Id = ':id') => `/report/${id}`,
  exports: '/mes-telechargements',
  companies: '/entreprises',
  companiesPro: '/mes-entreprises',
  companyAccesses: (siret: string = ':siret') => `/entreprise/acces/${siret}`,
  companies_toActivate: '/entreprises/a-activer',
  companies_registered: '/entreprises/les-plus-signalees',
  users: '/admin/invitation-ccrf',
  users_pending: '/admin/invitation-ccrf/pending',
  users_all: '/admin/invitation-ccrf/all',
  settings: '/parametres'
}
