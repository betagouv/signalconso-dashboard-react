import { config } from 'conf/config'
import { isKindOfAdmin, User } from '../client/user/User'

const MATOMO_ENABLED = config.enableMatomo

declare const _paq: any

export class Matomo {
  private static previousTrackedPage?: string

  private static isAlreadyFired = (path: string) => {
    if (path !== Matomo.previousTrackedPage) {
      Matomo.previousTrackedPage = path
      return false
    }
    return true
  }

  static readonly trackEvent = (
    category: EventCategories,
    action: AnalyticAction,
    name?: any,
    value?: any,
    user?: User,
  ) => {
    if (enabledForUser(user)) {
      Matomo.push(['trackEvent', category, action, name, value])
    }
  }

  static readonly trackPage = (path: string, user: User) => {
    if (enabledForUser(user) && !Matomo.isAlreadyFired(path)) {
      Matomo.push(['setCustomUrl', config.appBaseUrl + path])
      Matomo.push(['trackPageView'])
    }
  }

  private static readonly push = (args: any[]) => {
    console.info('[Matomo]', ...args)
    if (MATOMO_ENABLED) {
      try {
        _paq.push(args)
      } catch (e) {
        console.error('[Matomo]', e)
        if (!(e instanceof ReferenceError)) {
          throw e
        }
      }
    }
  }
}

type AnalyticAction =
  | AuthenticationEventActions
  | AccountEventActions
  | AccessEventActions
  | StatisticsActions
  | NewsletterActions
  | OutilsIaActions

export enum EventCategories {
  Authentification = 'Authentification',
  CompteUtilisateur = 'Compte utilisateur',
  AccesDeLEntreprise = "Accès de l'entreprise",
  Statistiques = 'Statistiques',
  Newsletter = 'Newsletter',
  OutilsIa = 'Outils IA',
}

export enum AuthenticationEventActions {
  success = 'Authentification réussie',
  role = 'Rôle de la personne authentifiée',
  fail = 'Authentification en échec',
  forgotPasswordSuccess = 'Mot de passe oublié - envoi du mail',
  forgotPasswordFail = 'Mot de passe oublié - erreur technique',
  resetPasswordSuccess = 'Réinitialistation du mot de passe',
  resetPasswordFail = 'Réinitialistation du mot de passe - erreur technique',
}

export enum AccountEventActions {
  changeNameSuccess = 'Changement de nom réussi',
  changeNameFail = 'Changement de nom échec',
  changePasswordSuccess = 'Changement mdp réussi',
  changePasswordFail = 'Changement mdp en échec',
  registerUser = "Inscription d'un utilisateur",
}

export enum AccessEventActions {
  addCompanyToAccount = "Ajout d'une entreprise à un compte",
  activateCompanyCode = "Activation d'une entreprise",
}

export enum StatisticsActions {
  reportCountsBySubcategories = 'Consultation de la page du nombre de signalements par sous catégories',
}

export enum OutilsIaActions {
  analyseProblemesEntreprise = `Lancement de l'analyse IA des problèmes d'une entreprise`,
}

export enum NewsletterActions {
  reportsClik = 'ClickNewsletterSubscribeButton',
}

export enum ActionResultNames {
  success = 'Succès',
  fail = 'Echec',
}

export function injectMatomoScript() {
  if (MATOMO_ENABLED) {
    var _paq = ((window as any)._paq = (window as any)._paq || [])
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['setDocumentTitle', document.domain + '/' + document.title])
    _paq.push(['setCookieDomain', 'admin.signal.conso.gouv.fr'])
    _paq.push(['setDomains', ['admin.signal.conso.gouv.fr']])
    _paq.push(['trackPageView'])
    _paq.push(['enableLinkTracking'])
    _paq.push(['HeatmapSessionRecording::enable'])
    ;(function () {
      var u = 'https://stats.beta.gouv.fr/'
      _paq.push(['setTrackerUrl', u + 'matomo.php'])
      _paq.push(['setSiteId', '62'])
      var d = document,
        g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0]
      g.async = true
      g.src = u + 'matomo.js'
      s.parentNode?.insertBefore(g, s)
    })()
  } else {
    console.log('[Matomo] Injection of Matomo script disabled')
  }
}

function enabledForUser(user: User | undefined) {
  return !user || !(user.impersonator || isKindOfAdmin(user))
}
