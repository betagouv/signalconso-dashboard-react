import {ReportResponseTypes} from '../../api'

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
  delete: 'Supprimer',
  deleted: 'Supprimé',
  try: 'Try',
  settings: 'Settings',
  status: 'Status',
  save: 'Save',
  saved: 'Saved',
  duplicate: 'Duplicate',
  anErrorOccurred: 'Un erreur s\'est produite.',
  minimize: 'Minimize',
  required: 'Requis',
  cancel: 'Annuler',
  created_at: 'Créé le',
  validated: 'Validé',
  configuration: 'Configuration',
  general: 'General',
  name: 'Nom',
  others: 'Autres',
  description: 'Description',
  deploy: 'Deploy',
  unknown: 'Unknown',
  new: 'New',
  start: 'Début',
  clear: 'Clear',
  cron: 'Cron',
  removeAsk: 'Supprimer ? ',
  exportInXLS: 'Exporter en XLS',
  removeAllFilters: 'Supprimer les filtres',
  removeReportDesc: (siret: string) => `Le signalement ${siret} sera supprimé. Cette action est irreversible.`,
  download: 'Télécharger',
  remainingTime: 'Remaining time',
  speed: 'Speed',
  key: 'Key',
  value: 'Value',
  invite: 'Inviter',
  stringValue: 'String value',
  numberValue: 'Number value',
  parameters: 'Parameters',
  startedAt: 'Started at',
  startedBy: 'Started by',
  endedAt: 'Ended at',
  anonymous: 'Anonyme',
  active: 'Actif',
  seeMore: 'Voir plus',
  apiToken: 'Api token',
  login: 'Connexion',
  error: 'Erreur',
  email: 'Email',
  password: 'Mot de passe',
  logout: 'Déconnexion',
  home: 'Accueil',
  consumer: 'Consommateur',
  company: 'Entreprise',
  address: 'Adresse',
  atLeast8Characters: 'At least 8 characters',
  invalidEmail: 'Invalid email',
  firstName: 'Prénom',
  lastName: 'Nom',
  selectedPeriod: 'Période sélectionnée',
  department: 'Département',
  selectAllDepartments: 'Tous les départements',
  reports: 'Signalements',
  report: 'Signalement',
  reportHistory: 'Historique du signalement',
  reports_pageTitle: 'Suivi des signalements',
  report_pageTitle: `Signalement`,
  details: 'Détails',
  reportCategoriesAreSelectByConsumer: 'Les catégories du signalement sont sélectionnées par le consommateur.',
  reportConsumerWantToBeAnonymous: 'Le consommateur souhaite rester anonyme',
  cannotExportMoreReports: (reportCount: number) => `Impossible d'exporter plus de ${reportCount} signalements.`,
  siret: 'SIRET',
  postalCodeShort: 'CP',
  files: 'Fichiers',
  problem: 'Problème',
  creationDate: 'Création',
  reportsCount: 'Nombre de signalements',
  emailConsumer: 'Email conso.',
  keywords: 'Mots-clés',
  tags: 'Tags',
  categories: 'Catégories',
  foreignCountry: 'Pays étranger',
  identifiedCompany: 'Entreprise identifiée ?',
  indifferent: 'Indifférent',
  phone: 'Téléphone',
  website: 'Site web',
  howItWorks: 'Comment ça marche ?',
  helpCenter: 'Centre d\'aide',
  menu_phones: 'Téléphones signalés',
  menu_websites: 'Sites webs signalés',
  menu_reports: 'Signalements',
  menu_companies: 'Entreprises',
  menu_exports: 'Mes exports',
  menu_users: 'Utilisateurs DGCCRF',
  menu_subscriptions: 'Abonnements',
  category: 'Catégorie',
  proResponse: 'Réponse du professionnel',
  addProAttachmentFile: 'Ajouter une pièces jointe fournie par l\'entreprise',
  attachedFiles: 'Pièces jointes',
  invalidSize: (maxSize: number) => `La taille du fichier dépasse les ${maxSize} Mb`,
  somethingWentWrong: `Une erreur s'est produite`,
  altLogoSignalConso: `Logo SignalConso / Retour à la page d'accueil`,
  toggleDatatableColumns: 'Affichier/Masquer des colonnes',
  altLogoGouv: `Logo Gouvernement - Ministère de l'Economie, des Finances et de la Relance`,
  reportDgccrfDetails: 'Informations complémentaires pour la DGCCRF',
  selectCountries_onlyEU: 'Pays européens (UE)',
  selectCountries_onlyTransfer: 'Pays avec accord',
  reportedPhoneTitle: 'Suivi des téléphones',
  advancedFilters: 'Filtres avancés',
  noAnswerFromPro: 'Le professionnel n\'a pas encore répondu au signalement',
  companiesSearchPlaceholder: 'Rechercher par nom, SIREN, SIRET, identifiant...',
  companiesToActivate: 'En attente d\'activation',
  companiesActivated: 'Entreprises identifiées',
  noCompanyFound: 'Aucune entreprise trouvée',
  registerACompany: 'Enregistrer une entreprise',
  noDataAtm: 'Aucune donnée',
  noReportsTitle: 'Aucun signalement',
  noReportsDesc: 'Aucun signalement ne correspond à votre recherche.',
  lastNotice: 'Relancé le',
  validateLetterSent: 'Valider l\'envoi des courriers',
  validateLetterSentTitle: 'Valider l\'envoi des courriers',
  validateLetterSentDesc: 'Les courriers seront considérés envoyés pour les entreprises sélectionnées. Cette action est irrévocable.',
  dgccrfUsers: 'Agents DGCCRF',
  invitationDate: 'Date d\'invitation',
  connectedUnder3Months: 'Connecté dans les 3 derniers mois',
  pendingInvitation: 'Invitation en attente',
  users_invite_dialog_title: 'Inviter un agent DGCCRF',
  users_invite_dialog_desc: 'Un courrier électronique sera envoyé à l\'adresse e-mail saisie ci-dessus avec un lien sécurisé permettant de créer un compte DGCCRF.',
  selectedCompanies: `entreprises sélectionnées`,
  nLines: (n: number) => `<b>${n}</b> lignes`,
  reportResponse: {
    [ReportResponseTypes.Accepted]: 'Signalement pris en compte',
    [ReportResponseTypes.Rejected]: 'Signalement infondé',
    [ReportResponseTypes.NotConcerned]: 'Etablissement non concerné par le signalement',
  },
}
