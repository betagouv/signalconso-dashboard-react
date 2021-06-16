import {Id} from './api/model'

export const siteMap = {
  reportedWebsites: '/moderation-url-entreprises',
  reportedPhone: '/suivi-des-telephones',
  reports: '/reports',
  subscriptions: '/abonnements',
  report: (id: Id = ':id') => `/reports/${id}`,
  users: '/admin/invitation-ccrf',
  exports: '/mes-telechargements',
  companies: '/companies',
}
