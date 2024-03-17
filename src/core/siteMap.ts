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

    // tools: '/tools',
    // testTools: `/tools/test`,
    // adminTools: `/tools/admin`,

    reportedWebsites: {
      value: '/moderation-url-entreprises/*',
      unknown: {
        value: 'sites-internet/non-identifies',
      },
      investigation: {
        value: 'enquete',
      },
    },
    // reportedWebsites: `/moderation-url-entreprises`,
    // reportedWebsites_unknown: `/moderation-url-entreprises/sites-internet/non-identifies`,
    // websitesInvestigation: `/moderation-url-entreprises/enquete`,

    reportedPhone: `/suivi-des-telephones`,
    reports: (_?: Partial<ReportSearch>) => `/suivi-des-signalements` + (_ ? toQueryString(mapDatesToQueryString(_)) : ``),
    reportsfiltred: {
      closed: `/suivi-des-signalements-clotures`,
    },
    subscriptions: `/abonnements`,
    report: (id: Id = `:id`) => `/suivi-des-signalements/report/${id}`,
    exports: `/mes-telechargements`,
    // companies_toActivate: `a-activer`,
    // companies_toFollowUp: `a-relancer`,
    // companies_registered: `les-plus-signalees`,
    // companies: `/entreprises/*`,
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
    companiesPro: `/mes-entreprises`,
    joinInformation: `/information`,
    companyAccesses: (siret: string = `:siret`) => `/entreprise/acces/${siret}`,
    company: (id: Id) => `/bilan-entreprise/${id}`,

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
    // users: `/users`,
    // users_agent_pending: `/users/pending`,
    // users_consumer_validation: `/users/consumers`,
    // users_auth_attempts: (email?: string) => `/users/auth-attempts` + (email ? toQueryString({email}) : ``),
    // users_blacklist: `/users/blacklist`,
    // users_agent: `/users/agent`,
    // users_admin: `/users/admin`,

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
    // stats: `/stats`,
    // proStats: `/stats/pro-stats`,
    // dgccrfStats: `/stats/dgccrf-stats`,
    // reportStats: `/stats/report-stats`,
    // countBySubCategories: `/stats/countBySubCategories`,
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
