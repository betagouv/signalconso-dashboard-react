import {mapDatesToQueryString} from './helper/useQueryString'
import {toQueryString} from './helper'
import {ReportSearch} from './client/report/ReportSearch'
import {Id} from './model'

export const siteMap = {
  logged: {
    tools: {
      value: '/tools/*',
      test: {
        value: 'test',
      },
      admin: {
        value: 'admin',
      },
    },

    reportedWebsites: {
      value: '/moderation-url-entreprises/*',
      unknown: {
        value: 'sites-internet/non-identifies',
      },
      investigation: {
        value: 'enquete',
      },
    },
    reportedPhone: `/suivi-des-telephones`,
    reports: (_?: Partial<ReportSearch>) => `/suivi-des-signalements` + (_ ? toQueryString(mapDatesToQueryString(_)) : ``),
    reportsfiltred: {
      closed: `/suivi-des-signalements-clotures`,
    },
    subscriptions: `/abonnements`,
    report: (id: Id = `:id`) => `/suivi-des-signalements/report/${id}`,
    exports: `/mes-telechargements`,

    companies: {
      value: '/entreprises/*',
      toActivate: {
        value: `a-activer`,
      },
      toFollowUp: {
        value: `a-relancer`,
      },
      registered: {
        value: `les-plus-signalees`,
      },
    },
    company: (id: Id) => ({
      value: `/entreprise/${id}/*`,
      stats: {
        value: `bilan`,
        valueAbsolute: `/entreprise/${id}/bilan`,
      },
      accesses: {
        value: `accesses`,
        valueAbsolute: `/entreprise/${id}/accesses`,
      },
      history: {
        value: `history`,
        valueAbsolute: `/entreprise/${id}/history`,
      },
    }),
    companiesPro: `/mes-entreprises`,
    joinInformation: `/information`,
    users: {
      root: '/users',
      value: function () {
        return `${this.root}/*`
      },
      basePath: function () {
        return `${this.root}/`
      },
      auth_attempts: {
        value: (email?: string) => `auth-attempts` + (email ? toQueryString({email}) : ``),
      },
      agent_pending: {
        value: `pending`,
      },
      consumer_validation: {
        value: `consumers`,
      },
      blacklist: {
        value: `blacklist`,
      },
      agent: {
        value: `agent`,
      },
      admin: {
        value: `admin`,
      },
    },

    updateEmail: (token: string) => `/parametres/update-email/${token}`,
    settings: `/parametres`,
    modeEmploiDGCCRF: `/mode-emploi-dgccrf`,

    stats: {
      value: '/stats/*',
      pro: {
        value: 'pro-stats',
      },
      dgccrf: {
        value: 'dgccrf-stats',
      },
      report: {
        value: 'report-stats',
      },
      countBySubCategories: {
        value: 'countBySubCategories',
      },
    },
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
