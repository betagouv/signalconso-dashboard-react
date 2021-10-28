import {CompanyAccessLevel, ReportResponseTypes, ReportStatus} from '@signal-conso/signalconso-api-sdk-js'
import {Config} from '../../../conf/config'

export const messagesFr = {
  yes: 'Oui',
  no: 'Non',
  search: 'Rechercher',
  edit: 'Modifier',
  next: 'Suivant',
  nextStep: 'Next step',
  close: 'Fermer',
  confirm: 'Confirmer',
  create: 'Créer',
  end: 'Fin',
  see: 'Voir',
  test: 'Test',
  date: 'Date',
  add: 'Ajouter',
  previous: 'Précédent',
  back: 'Retour',
  count: 'Nombre',
  delete: 'Supprimer',
  deleted: 'Supprimé',
  try: 'Try',
  settings: 'Paramètres',
  status: 'Statut',
  notification: 'Notification',
  notifications: 'Notifications',
  statusEdited: 'Status modifié.',
  save: 'Sauvegarder',
  saved: 'Sauvegardé',
  duplicate: 'Duplicate',
  anErrorOccurred: "Une erreur s'est produite.",
  minimize: 'Minimize',
  required: 'Requis',
  cancel: 'Annuler',
  help: 'Aide',
  created_at: 'Créé le',
  validated: 'Validé',
  notValidated: 'Non validé',
  configuration: 'Configuration',
  general: 'General',
  name: 'Nom',
  others: 'Autres',
  description: 'Description',
  deploy: 'Déployer',
  unknown: 'Inconnu',
  new: 'New',
  start: 'Début',
  startUp: 'Démarrer',
  inProgress: 'En cours...',
  cancelAll: `Tout annuler`,
  clear: 'Clear',
  cron: 'Cron',
  removeAsk: 'Supprimer ? ',
  thisWillBeRemoved: (_: string) => `La pièce jointe <b>${_}</b> sera définitivement supprimée.`,
  exportInXLS: 'Exporter en XLS',
  removeAllFilters: 'Supprimer les filtres',
  removeReportDesc: (siret: string) => `Le signalement ${siret} sera supprimé. Cette action est irréversible.`,
  download: 'Télécharger',
  remainingTime: 'Temps restant',
  forgottenPassword: 'Mot de passe oublié',
  forgottenPasswordDesc: 'Vous recevrez un email vous permettant de créer un nouveau mot de passe.',
  createNewPassword: 'Créer un nouveau mot de passe',
  speed: 'Speed',
  key: 'Key',
  value: 'Value',
  invite: 'Inviter',
  activate_all: 'Tout Activer',
  block_all: 'Tout Bloquer',
  parameters: 'Paramètres',
  startedAt: 'Démarré le',
  startedBy: 'Démarré le',
  receivedAt: 'Reçu le',
  endedAt: 'Terminé le',
  anonymous: 'Anonyme',
  active: 'Actif',
  seeMore: 'Voir plus',
  apiToken: 'Api token',
  login: 'Connexion',
  error: 'Erreur',
  email: 'Email',
  signin: 'Connexion',
  signup: 'Inscription',
  password: 'Mot de passe',
  logout: 'Déconnexion',
  home: 'Accueil',
  consumer: 'Consommateur',
  company: 'Entreprise',
  identification: 'Identification du pays',
  address: 'Adresse',
  activateMyAccount: 'Activer mon compte',
  createMyAccount: 'Créer mon compte',
  atLeast8Characters: '8 caractères minimum',
  invalidEmail: 'Email invalide',
  firstName: 'Prénom',
  lastName: 'Nom',
  addCompany: `Enregister l'entreprise`,
  addACompany: `Enregister une entreprise`,
  youReceivedNewLetter: `Vous avez reçu un courrier postal ?`,
  siretOfYourCompany: `SIRET de votre entreprise`,
  siretOfYourCompanyDesc: `Il doit correspondre à la raison sociale indiquée sur le courrier.`,
  siretOfYourCompanyInvalid: `Le SIRET doit comporter 14 chiffres.`,
  activationCode: `Code d'activation`,
  activationCodeDesc: `Code à 6 chiffres indiqué sur le courrier.`,
  activationCodeInvalid: `Le code doit comporter 6 chiffres.`,
  emailDesc: `Adresse email de votre choix.`,
  activityCode: `Code d'activité`,
  days: `jours`,
  avgResponseTime: `Temps de réponse moyen`,
  avgResponseTimeDesc: `Sur les signalements ayant obtenu une réponse.`,
  selectedPeriod: 'Période sélectionnée',
  department: 'Département',
  companyRegistered: 'Entreprise enregistrée',
  companyRegisteredEmailSent: "Un email vous a été envoyé avec les instructions pour accéder au compte de l'entreprise.",
  departments: 'Départements',
  reports: 'Signalements',
  responseRate: 'Taux de réponse',
  report: 'Signalement',
  you: 'Vous',
  reportHistory: 'Historique du signalement',
  reportedWebsites: 'Suivi des sites internet',
  reportedCompaniesWebsites: 'Associations sites / entreprises',
  reportedUnknownWebsites: 'Sites non identifiés',
  companyHistory: "Historique de l'entreprise",
  reports_pageTitle: 'Suivi des signalements',
  notificationsAreDisabled: `Inclus les notifications concernant les signalements des entreprises.`,
  notificationSettings: `Emails reçus lors d'un nouveau signalement.`,
  notificationAcceptForCompany: "Autoriser l'envoi d'emails concernant les signalements d'une entreprise.",
  notificationDisableWarning: `Désactiver les notifications`,
  notificationDisableWarningDesc: `Attention, si vous désactivez les notifications, vous ne recevrez plus les nouveaux signalements par mail. Vous devrez vous connecter régulièrement sur votre espace pour consulter les nouveaux signalements.`,
  report_pageTitle: `Signalement`,
  details: 'Détails',
  answer: 'Répondre',
  invitNewUser: 'Inviter un nouvel utilisateur',
  editPassword: 'Modification du mot de passe.',
  editPasswordDesc: 'Changez votre mot de passe.',
  editPasswordDialogDesc: 'Le mot de passe doit avoir 8 caractères minimum.',
  reportCategoriesAreSelectByConsumer: 'Les catégories du signalement sont sélectionnées par le consommateur.',
  reportConsumerWantToBeAnonymous: 'Le consommateur souhaite rester anonyme',
  cannotExportMoreReports: (reportCount: number) => `Impossible d'exporter plus de ${reportCount} signalements.`,
  siret: 'SIRET',
  postalCodeShort: 'CP',
  files: 'Fichiers',
  problem: 'Problème',
  creation: 'Création',
  creationDate: 'Date de création',
  reportsCount: 'Nombre de signalements',
  responsesCount: 'Nombre de réponses',
  emailConsumer: 'Email conso.',
  pro: 'Professionnels',
  number: `Numéro`,
  numberShort: `N°`,
  day: 'Jour',
  week: 'Semaine',
  month: 'Mois',
  street: `Rue`,
  addressSupplement: `Complément d'adresse`,
  postalCode: `Code postal`,
  city: `Ville`,
  keywords: 'Mots-clés',
  tags: 'Tags',
  categories: 'Catégories',
  foreignCountry: 'Pays étranger',
  identifiedCompany: 'Entreprise identifiée ?',
  indifferent: 'Indifférent',
  phone: 'Téléphone',
  website: 'Site web',
  websites: 'Sites web',
  howItWorks: 'Comment ça marche ?',
  helpCenter: "Centre d'aide",
  menu_phones: 'Téléphones signalés',
  menu_modeEmploiDGCCRF: `Mode d'emploi`,
  menu_websites: 'Sites webs signalés',
  menu_reports: 'Signalements',
  menu_companies: 'Entreprises',
  menu_exports: 'Mes exports',
  menu_users: 'Utilisateurs DGCCRF',
  menu_subscriptions: 'Abonnements',
  menu_settings: 'Paramètres',
  category: 'Catégorie',
  myCompanies: 'Mes entreprises',
  returnDate: 'Date de retour',
  proResponse: 'Réponse du professionnel',
  searchByEmail: 'Rechercher par email',
  undeliveredDoc: 'Courrier retourné',
  undeliveredDocTitle: "Retour du courrier d'activation",
  searchByHost: 'Rechercher par nom de domaine',
  addProAttachmentFile: "Ajouter une pièces jointe fournie par l'entreprise",
  addAttachmentFile: 'Ajouter une pièces jointe',
  attachedFiles: 'Pièces jointes',
  database: `Base de données`,
  beginning: `Début`,
  invalidSize: (maxSize: number) => `La taille du fichier dépasse les ${maxSize} Mb`,
  somethingWentWrong: `Une erreur s'est produite`,
  altLogoSignalConso: `Logo SignalConso / Retour à la page d'accueil`,
  toggleDatatableColumns: 'Affichier/Masquer des colonnes',
  altLogoGouv: `Logo Gouvernement - Ministère de l'Economie, des Finances et de la Relance`,
  altLogoDGCCRF: `Logo DGCCRF - Direction générale de la Concurrence, de la Consommation et de la Répression des fraudes`,
  noAttachment: 'Aucune pièce jointe.',
  reportDgccrfDetails: 'Informations complémentaires pour la DGCCRF',
  selectCountries_onlyEU: 'Pays européens (UE)',
  registerCompanyError: `Échec de l'activation`,
  activateUserError: `Échec de la création du compte`,
  registerCompanyErrorDesc: `Avez-vous utilisé le bon SIRET ? Pour une même adresse physique, il est possible d'avoir plusieurs entités juridiques et donc plusieurs SIRET (exploitant, gestionnaire...).`,
  selectCountries_onlyTransfer: 'Pays avec accord',
  reportedPhoneTitle: 'Suivi des téléphones',
  noExport: 'Aucun export',
  noAssociation: 'Non associé',
  linkCountry: 'Associer un pays étranger au site internet',
  linkCompany: 'Associer une entreprise au site internet',
  proAnswerVisibleByDGCCRF: 'Votre réponse sera visible par le consommateur et la DGCCRF.',
  proAnswerResponseType: 'Pouvez-vous préciser votre réponse ?',
  proAnswerYourAnswer: 'Votre réponse',
  text: 'Text',
  onlyVisibleByDGCCRF: `Visibles uniquement par la <b>DGCCRF</b><div class=""></div>`,
  proAnswerYourAnswerDesc: `
    <b>Le consommateur</b> la recevra par mail. Elle pourra aussi être consultée par la <b>DGCCRF</b>.<br/>
    Nous vous demandons de rester courtois dans votre réponse. Les menaces et insultes n'ont pas leur place dans SignalConso !
  `,
  proAnswerYourDGCCRFAnswer: 'Informations complémentaires',
  proAnswerYourDGCCRFAnswerDesc: `
    Ces précisions sont à <b>l'attention de la DGCCRF</b>. Elles ne seront pas transmises au consommateur.
  `,
  proAnswerSent: 'Votre réponse a été envoyée au consommateur. Elle sera aussi consultable par la DGCCRF.',
  reportResponseDesc: {
    [ReportResponseTypes.Accepted]: 'Je prends en compte ce signalement',
    [ReportResponseTypes.Rejected]: "J'estime que ce signalement est infondé",
    [ReportResponseTypes.NotConcerned]: "J'estime que ce signalement ne concerne pas mon établissement",
  },
  selectAll: `Tout sélectionner`,
  advancedFilters: 'Filtres avancés',
  comment: 'Commentaire',
  commentAdded: 'Commentaire ajouté',
  dgccrfControlDone: 'Contrôle effectué',
  noAnswerFromPro: "Le professionnel n'a pas encore répondu au signalement.",
  companiesSearchPlaceholder: 'Rechercher par nom, SIREN, SIRET, identifiant...',
  companySearch: 'Rechercher une entreprise',
  emailValidation: `Validation de l'adresse email`,
  anonymousReport: 'Signalement anonyme',
  send: `Envoyer`,
  responses: 'Réponses',
  informations: `Informations`,
  reviews: `Avis`,
  consumerReviews: `Avis consommateur`,
  consumerReviewsDesc: `Avis du consommateur sur la réponse apportée par le Profesionnel.`,
  companySearchLabel: 'SIREN, SIRET ou RCS',
  accountActivated: 'Compte activé',
  accountsActivated: `Comptes activés`,
  companiesToActivate: "En attente d'activation",
  activationFailed: "Erreur inattendue , impossible d'activer le compte. Merci de bien vouloir réessayer ultérieurement.",
  companiesActivated: 'Entreprises identifiées',
  noCompanyFound: 'Aucune entreprise trouvée',
  isHeadOffice: 'Siège sociale',
  activationDocReturned: `Courriers retournés`,
  shareYourMind: `Donner votre avis`,
  thanksForSharingYourMind: `Votre avis a bien été pris en compte, nous vous en remercions.`,
  didTheCompanyAnsweredWell: `Est-ce que la réponse de l'entreprise répond à vos attentes ?`,
  addDgccrfComment: 'Commentaire (interne à la DGCCRF)',
  markDgccrfControlDone: 'Contrôle effectué (interne à la DGCCRF)',
  thisDate: (_: string) => `Le ${_}`,
  byHim: (_: string) => `Par ${_}`,
  copyAddress: `Copier l'adresse`,
  youCanAddCommentForDGCCRF: `Vous pouvez, si vous le souhaitez, apporter une précision <b>à l'attention de la DGCCRF</b> qui ne sera pas transmise à l'entreprise`,
  youCanNoteSignalConso: `Vous pouvez également donner votre avis sur SignalConso`,
  addressCopied: `Adresse copiée`,
  governmentCompany: 'Administration publique',
  registerACompany: 'Enregistrer une entreprise',
  noDataAtm: 'Aucune donnée',
  linkNotValidAnymore: `Le lien sur lequel vous avez cliqué n'est plus valide.`,
  linkNotValidAnymoreDesc: `Si vous avez déjà validé votre email, vous pouvez vous connecter à l'aide de votre adresse email et mot de passe.`,
  noReportsTitle: 'Aucun signalement',
  noReportsDesc: 'Aucun signalement ne correspond à votre recherche.',
  lastNotice: 'Relancé le',
  validatingEmail: `Validation de l'adresse email...`,
  validateLetterSent: "Valider l'envoi des courriers",
  emailValidated: `Votre email est validé.`,
  emailValidatedDesc: `Vous pouvez vous connecter à l'aide de votre adresse email et mot de passe.`,
  validateLetterSentTitle: "Valider l'envoi des courriers",
  sendNewPostal: `Envoyer un nouveau courrier`,
  companiesDbSyncInfo: `
    Le fichier <b>StockEtablissement</b> doit être, de préférence, lancé en premier. 
    <br.>
    Le fichier <b>StockUniteLegale</b> permet d'obtenir le nom de l'établissement lorsqu'il est absent du fichier <b>StockEtablissement</b>.
    <br/>
    <br/>
    La sychronisation peut être lancée et annulée à tout moment sans risque.
  `,
  loginForbidden: `Compte bloqué (trop de tentatives, veuillez réessayer dans 30 minutes)`,
  loginLocked: `Votre adresse email doit être validée, un e-mail vient de vous être envoyé avec un lien à cet effet.`,
  loginFailed: `Échec de l'authentification`,
  companyActivationNotFound: `Le SIRET ou le code d'activation est invalide.`,
  validateLetterSentDesc:
    'Les courriers seront considérés envoyés pour les entreprises sélectionnées. Cette action est irrévocable.',
  dgccrfUsers: 'Agents DGCCRF',
  lastReports: `Derniers signalements`,
  invitationDate: "Date d'invitation",
  connectedUnder3Months: 'Connecté dans les 3 derniers mois',
  pendingInvitation: 'Invitation en attente',
  users_invite_dialog_title: 'Inviter un agent DGCCRF',
  enableAll: `Tout activer`,
  disable: `Désactiver`,
  disableAll: `Tout désactiver`,
  users_invite_dialog_desc:
    "Un courrier électronique sera envoyé à l'adresse e-mail saisie ci-dessus avec un lien sécurisé permettant de créer un compte DGCCRF.",
  selectedCompanies: `entreprises sélectionnées`,
  passwordNotLongEnough: '8 caractères minimum',
  oldPassword: 'Ancien mot de passe',
  companyCreated: 'Entreprise créée',
  codeNaf: 'Code NAF',
  cannotCreateCompanyMissingInfo: `Impossible de créer l'entreprise. Son nom ou son adresse ne sont pas renseignés.`,
  editAddress: `Modifier l'adresse de l'entreprise`,
  companyAccessLevelDescription: {
    [CompanyAccessLevel.admin]: 'Peut  consulter, répondre aux signalements et inviter/supprimer des nouveaux utilisateurs.',
    [CompanyAccessLevel.member]: 'Peut consulter et répondre aux signalements.',
  },
  invitationToProAlreadySent: (email: string) => `Une invitation a déjà été envoyée à l'adresse ${email}.`,
  editedAddress: `Adresse modifiée`,
  failedToChangePassword: 'Impossible de modifier le mot de passe.',
  passwordAreIdentical: 'Les mots de passe sont identiques',
  passwordDoesntMatch: "Le mot de passe n'est pas identique",
  passwordEdited: 'Mot de passe modifié.',
  invalidPassword: 'Mot de passe incorrect',
  newPassword: 'Nouveau mot de passe',
  subscription: 'Abonnement',
  emailSentToYou: 'Un email vous a été envoyé.',
  removeSubscription: "Supprimer l'abonnement",
  newPasswordConfirmation: 'Confirmation',
  userInvitationSent: 'Invitation envoyée',
  companyAccessLevel: 'Autorisation',
  editAccess: `Modifier l'accès`,
  emailDGCCRFValidation: 'Email invalide. Email acceptés : *.gouv.fr',
  companyAccessesTitle: 'Gestion des accès',
  daily: 'Quotidienne',
  yourAccountIsActivated: `Votre compte est bien activé, vous pouvez consulter <strong>votre signalement</strong>.`,
  weekly: 'Hebdomadaire',
  handleAccesses: 'Gérer les accès',
  accesses: 'Accès',
  validate: 'Valider',
  authorization: `Autorisation`,
  contactAgreement: 'Accord pour contact par entreprise',
  activationDocumentRequired: `Envoyer un nouveau courrier`,
  editConsumer: 'Modifier les informations du consommateur',
  changesSaved: 'Modification enregistrée',
  selectAllDepartments: 'Tous les départements',
  deleteCompanyAccess: (name: string) => `Supprimer l\'accès à ${name} ?`,
  deleteCompanyAccessToken: (email?: string) => `Annuler l'invitation  ${email ? 'à ' + email + ' ' : ''}?`,
  resetPasswordNotFound: `Le lien permettant de demander un nouveau mot de passe n'est pas valide, veuillez refaire une demande.`,
  resetPasswordSuccess: `Votre mot de passe est maintenant créé, vous pouvez vous connecter pour accéder à votre espace entreprise.`,
  loginIssueTip: `En cas de difficultés, vous pouvez contacter par email le service <a href="href="mailto:${Config.contactEmail}">${Config.contactEmail}</a>.`,
  consent: ` Je reconnais avoir pris connaissance des  <a href="href="${Config.appBaseUrl}/conditions-generales-utilisation/professionnel"> conditions générales d'utilisation</a> de SignalConso.`,
  subscriptionsAlertInfo: `
    En créant un abonnement, vous recevrez un mail quotidien ou hebdomadaire (au choix) comportant les nouveaux signalements correspondant à votre sélection de critères, qu’ils soient géographiques, thématiques ou par entreprise.
    <br/>
    <b>Ces différents critères peuvent se combiner.</b>
    <br/>
    <br/>
    Par exemple, si vous souhaitez recevoir les signalements liés à deux entreprises bancaires et ceux liés au secteur de l'immobilier, il faut créer deux alertes : une avec les deux siret et une avec la catégorie immobilier.
  `,
  cannotActivateAccountAlertTitle: `Le lien sur lequel vous avez cliqué n'est plus valide.`,
  cannotActivateAccountAlertInfo: `
    <p>Si vous avez déjà créé votre compte, vous pouvez vous <a href="href="/connexion"/conditions-generales-utilisation/professionnel">connecter</a> à l'aide de votre adresse email et mot de passe.</p>
    Sinon, vous pouvez demander au gestionnaire de l'entreprise de vous envoyer une nouvelle invitation.
  `,
  alreadySelectedCompany: (name?: string) => `L'entreprise ${name ?? ''} est déjà sélectionnée`,
  alreadySelectedCountry: (name?: string) => `Le pays ${name ?? ''} est déjà sélectionnée`,
  nLines: (n: number) => `<b>${n}</b> lignes`,
  reportResponse: {
    [ReportResponseTypes.Accepted]: 'Signalement pris en compte',
    [ReportResponseTypes.Rejected]: 'Signalement infondé',
    [ReportResponseTypes.NotConcerned]: 'Etablissement non concerné par le signalement',
  },
  reportStatusShort: {
    [ReportStatus.NA]: 'NA',
    [ReportStatus.EmployeeConsumer]: "Lanceur d'alerte",
    [ReportStatus.InProgress]: 'Traitement en cours',
    [ReportStatus.Unread]: 'Non consulté',
    [ReportStatus.UnreadForPro]: 'Non consulté',
    [ReportStatus.Transmitted]: 'Transmis',
    [ReportStatus.ToReviewedByPro]: 'À répondre',
    [ReportStatus.Accepted]: `Promesse d'action`,
    [ReportStatus.ClosedForPro]: 'Clôturé',
    [ReportStatus.Rejected]: 'Infondé',
    [ReportStatus.Ignored]: 'Consulté ignoré',
    [ReportStatus.NotConcerned]: 'Mal attribué',
  },
  reportStatusDesc: {
    [ReportStatus.NA]: `Il y a eu un signalement déposé par un consommateur. Mais, le consommateur n’a pas pu identifier la société. Cela peut être le cas pour les sites internet et des démarchages téléphoniques ou à domicile.`,
    [ReportStatus.EmployeeConsumer]: `Le signalement n’est pas envoyé au professionnel. Cela correspond aux cas où le consommateur s’est signalé comme employé du professionnel.`,
    [ReportStatus.InProgress]: `Statut intermédiaire indiquant que le signalement suit son cours et n'est pas clos. Cela correspond notamment à la période laissée au professionnel pour prendre connaissance du signalement ou y répondre.`,
    [ReportStatus.UnreadForPro]: 'Non consulté',
    [ReportStatus.Unread]: `Le professionnel n'a pas créé de compte pour lire le signalement malgré les relances.`,
    [ReportStatus.Transmitted]: `Transmis`,
    [ReportStatus.ToReviewedByPro]: `À répondre`,
    [ReportStatus.Accepted]: `Le professionnel souhaite mettre en place une action préventive ou corrective.`,
    [ReportStatus.ClosedForPro]: `Clôturé`,
    [ReportStatus.Rejected]: `Le professionnel a déclaré le signalement comme infondé selon lui.`,
    [ReportStatus.Ignored]: `Le professionnel a lu le signalement, mais il n'a pas répondu malgré les relances.`,
    [ReportStatus.NotConcerned]: `Le consommateur n'a pas sélectionné le bon établissement. Il est important de rappeler que ce sont les consommateurs qui identifient le professionnel, avec un taux d’erreur d’environ 5% en pratique.`,
  },
  month_: {
    1: 'Janvier',
    2: 'Février',
    3: 'Mars',
    4: 'Avril',
    5: 'Mai',
    6: 'Juin',
    7: 'Juillet',
    8: 'Août',
    9: 'Septembre',
    10: 'Octobre',
    11: 'Novembre',
    12: 'Décembre',
  },
}
