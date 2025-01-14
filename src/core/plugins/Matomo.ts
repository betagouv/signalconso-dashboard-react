import { config } from 'conf/config'
import { isKindOfAdmin, Role, User } from '../client/user/User'

const MATOMO_ENABLED = config.enableMatomo

declare const _paq: any

let previousTrackedPage: string | undefined = undefined

function isAlreadyFired(path: string) {
  if (path !== previousTrackedPage) {
    previousTrackedPage = path
    return false
  }
  return true
}

function push(args: any[]) {
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

function doTrackEvent(
  user: User | undefined,
  category: EventCategories,
  action: AnalyticAction,
  name?: AnalyticActionNameFull,
  value?: any,
) {
  if (enabledForUser(user)) {
    push(['trackEvent', category, action, name, value])
  }
}

export function trackPage(path: string, user: User) {
  if (enabledForUser(user) && !isAlreadyFired(path)) {
    push(['setCustomUrl', config.appBaseUrl + path])
    push(['trackPageView'])
  }
}

export function trackEvent(
  user: User,
  category: EventCategories,
  action: AnalyticAction,
  name?: AnalyticActionNameFull,
  value?: string,
) {
  doTrackEvent(user, category, action, name, value)
}

export function trackEventUnconnected(
  category: EventCategories,
  action: AnalyticAction,
  name?: AnalyticActionNameFull,
  value?: string,
) {
  doTrackEvent(undefined, category, action, name, value)
}

type AnalyticAction =
  | AuthenticationEventActions
  | AccountEventActions
  | AccessEventActions
  | StatisticsActions
  | NewsletterActions
  | OutilsIaActions
  | ExportsActions
  | SignalementsActions

export enum EventCategories {
  Authentification = 'Authentification',
  CompteUtilisateur = 'Compte utilisateur',
  AccesDeLEntreprise = "Accès de l'entreprise",
  Statistiques = 'Statistiques',
  Newsletter = 'Newsletter',
  OutilsIa = 'Outils IA',
  Exports = 'Exports',
  Signalements = 'Signalements',
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

export enum ExportsActions {
  exportReportPdf = "Export d'un signalement format PDF",
  exportReportZip = "Export d'un signalement format zip avec pièces jointes",
  exportReportsPdf = 'Export de signalements format PDF combiné',
  exportReportsExcel = 'Export de signalements format Excel',
  exportUnknownWebsitesExcel = 'Export des sites webs non identifiés format Excel',
  exportPhonesExcel = 'Export des téléphones signalés format Excel',
}

export enum NewsletterActions {
  reportsClik = 'ClickNewsletterSubscribeButton',
}
export enum SignalementsActions {
  ajoutMarquePage = "Ajout d'un marque-page",
}

type AnalyticActionNameFull = AnalyticActionName | Role

export enum AnalyticActionName {
  success = 'Succès',
  fail = 'Echec',
  click = 'click',
  boutonAbonnezVous = 'Bouton ABONNEZ-VOUS',
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
