import {Id, ReportSearch} from './api/model'
import {toQueryString} from './api'

export const siteMap = {
  reportedWebsites: '/moderation-url-entreprises',
  reportedPhone: '/suivi-des-telephones',
  reports: (_?: Partial<ReportSearch>) => '/reports' + (_ ? toQueryString(_) : ''),
  subscriptions: '/abonnements',
  report: (id: Id = ':id') => `/reports/${id}`,
  users: '/admin/invitation-ccrf',
  exports: '/mes-telechargements',
  companies: '/companies',
}
