import {config} from '../../../conf/config'
import {formatDistance, formatDuration as formatDurationFns} from 'date-fns'
import {IdentificationType} from 'feature/ReportedWebsites/SelectWebsiteIdentification/SelectWebsiteIdentification'
import {ReportStatus, ReportStatusPro, ReportTag} from '../../client/report/Report'
import {CompanyAccessLevel} from '../../client/company-access/CompanyAccess'
import {IdentificationStatus} from '../../client/website/Website'
import {ReportResponseTypes, ResponseEvaluation} from '../../client/event/Event'

const invalidDate = '-'

const isDateValid = (d?: Date | any): boolean => {
  return !!d && d instanceof Date && !isNaN(d.getTime())
}

const formatDate = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return d!.toLocaleDateString()
}

const formatTime = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return d!.toLocaleTimeString()
}

const formatDateTime = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return formatDate(d) + ' ' + formatTime(d)
}

const dateFromNow = (d?: Date): string | undefined => {
  return d ? formatDistance(d, new Date(), {addSuffix: true}) : undefined
}

const formatLargeNumber = (n?: number): string => {
  return n !== undefined && n !== null ? n.toLocaleString('fr-FR') : '-'
}

const formatDuration = formatDurationFns

export const fr = {
  formatDate,
  formatTime,
  formatDateTime,
  dateFromNow,
  formatDuration,
  formatLargeNumber,
  messages: {
    reportTagDesc: {
      [ReportTag.LitigeContractuel]: 'Litige contractuel',
      [ReportTag.Hygiene]: 'Hygiène',
      [ReportTag.ProduitDangereux]: 'Produit dangereux',
      [ReportTag.DemarchageADomicile]: 'Démarchage à domicile',
      [ReportTag.Ehpad]: 'Ehpad',
      [ReportTag.DemarchageTelephonique]: 'Démarchage téléphonique',
      [ReportTag.AbsenceDeMediateur]: 'Absence de médiateur',
      [ReportTag.Bloctel]: 'Bloctel',
      [ReportTag.Influenceur]: 'Influenceur',
      [ReportTag.ReponseConso]: 'ReponseConso',
      [ReportTag.Internet]: 'Internet',
      [ReportTag.ProduitIndustriel]: 'Produit industriel',
      [ReportTag.ProduitAlimentaire]: 'Produit alimentaire',
      [ReportTag.CompagnieAerienne]: 'Compagnie aérienne',
      NA: 'Aucun tag',
    },
    IdentificationStatusDesc: {
      [IdentificationStatus.Identified]: 'Identifié',
      [IdentificationStatus.NotIdentified]: 'Non identifié',
    },
    investigationStatus: (s: string) => {
      switch (s) {
        case 'NotProcessed':
          return 'N/A'
        case 'Processing':
          return 'Identification en cours'
        case 'UnderInvestigation':
          return 'Enquête en cours'
        case 'InvestigationDone':
          return 'Enquête terminée'
        default:
          return s
      }
    },
    hide: 'Masquer',
    filter: 'Filtrer',
    yes: 'Oui',
    no: 'Non',
    positive: "Nombre d'utilisateurs satisfaits de la réponse donnée par l'entreprise",
    negative: "Nombre d'utilisateurs insatisfaits de la réponse donnée par l'entreprise",
    neutral: "Nombre d'utilisateurs partiellement satisfait de la réponse donnée par l'entreprise",
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
    identicationTools: "Outils d'identification",
    investigation: 'Enquête',
    affectation: 'Affectation',
    affectationTitle: 'Attribuer à une DD',
    noValue: 'N/A',
    practiceTitle: 'Attribuer une pratique',
    practice: 'Pratique',
    notification: 'Notification',
    notifications: 'Notifications',
    statusEdited: 'Status modifié.',
    save: 'Sauvegarder',
    saved: 'Sauvegardé',
    duplicate: 'Duplicate',
    all: 'Tous',
    menu: 'Menu',
    anErrorOccurred: "Une erreur s'est produite.",
    minimize: 'Minimize',
    required: 'Requis',
    cancel: 'Annuler',
    help: 'Aide',
    created_at: 'Créé le',
    kind: "Status d'identification",
    identified: 'Identifié',
    notIdentified: 'Non identifié',
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
    cannotUpdateWebsiteStatus: 'La validation nécéssite que le site soit identifié par une entreprise ou un pays',
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
    pin: `Épingler`,
    endedAt: 'Terminé le',
    anonymous: 'Anonyme',
    active: 'Actif',
    inactive: 'Non actif',
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
    identication: 'Identification',
    country: 'Pays',
    companyWebsiteIdentification: `Identification du site internet`,
    address: 'Adresse',
    activateMyAccount: 'Activer mon compte',
    createMyAccount: 'Créer mon compte',
    atLeast8Characters: '8 caractères minimum',
    invalidEmail: 'Email invalide',
    firstName: 'Prénom',
    lastName: 'Nom',
    attachTo: `Attacher à`,
    attachToType: {
      [IdentificationType.COMPANY]: `Une entreprise`,
      [IdentificationType.COUNTRY]: `Un pays étranger`,
    },
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
    avgResponseTimeDescNoData: `Aucun signalement n'a obtenu de réponse pour le moment`,
    selectedPeriod: 'Période sélectionnée',
    department: 'Département',
    url: 'URL',
    companyRegistered: 'Entreprise enregistrée',
    companyRegisteredEmailSent: "Un email vous a été envoyé avec les instructions pour accéder au compte de l'entreprise.",
    departments: 'Départements',
    reports: 'Signalements',
    myStats: 'Statistiques de mon entreprise',
    responseRate: '% réponse',
    report: 'Signalement',
    you: 'Vous',
    reportHistory: 'Historique du signalement',
    reportedWebsites: 'Suivi des sites internet',
    reportedCompaniesWebsites: 'Associations sites / entreprises',
    websitesInvestigation: 'Suivi des sites internet',
    showLabels: 'Afficher les valeurs :',
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
    editPassword: 'Modification du mot de passe',
    editName: 'Modification du nom',
    editPasswordDesc: 'Changez votre mot de passe.',
    editPasswordDialogDesc: 'Le mot de passe doit avoir 8 caractères minimum.',
    reportCategoriesAreSelectByConsumer: 'Les catégories du signalement sont sélectionnées par le consommateur.',
    reportConsumerWantToBeAnonymous: 'Le consommateur souhaite rester anonyme',
    cannotExportMoreReports: (reportCount: number) => `Impossible d'exporter plus de ${reportCount} signalements.`,
    siret: 'SIRET',
    siretFound: 'SIRET identifié',
    postalCodeShort: 'CP',
    files: 'Fichiers',
    problem: 'Problème',
    creation: 'Création',
    creationDate: 'Date de création',
    lastAttempt: `Dernière tentative`,
    lastValidationDate: `Dernière validation`,
    reportsDivision: 'Répartition des signalements',
    reportsDivisionDesc: `   
    <div>Répartition des signalements :</div>
    <ul>
        <li>Nombre total de signalements toute catégorie.</li>
        <li>Signalements de site internet.</li>
        <li>Signalements liés à un démarchage à domicile ou téléphonique. </li>
        <li>Signalement d'un magasin physique hors signalements de site internet et démarchage.</li>
    </ul>
  `,
    proUser: 'Comptes Professionnels',
    statsLandingPage: 'Statistiques Signal Conso',
    statsPro: 'Professionnel',
    statsDgccrf: 'DGCCRF',
    statsReports: 'Signalements',
    dgccrfUser: 'Comptes DGCCRF',
    dgccrfUserDesc: `   
    <div>Statistique des comptes DGCCRF :</div>
    <ul>
        <li>Nombre de compte DGCCRF en cumul (non actifs compris).</li>
        <li>Nombre de compte actifs (3 mois après la dernière validation de leur adresse e-mail).</li>
    </ul>
  `,
    dgccrfActions: 'Actions DGCCRF',
    dgccrfActionsDesc: `   
    <div>Statistique sur les actions des agents DGCCRF :</div>
    <ul>
        <li>Nombre d'abonnements au cumul</li>
        <li>Nombre d'entreprises contrôlées (retour par un agent DGCCRF sur signal conso du contrôle d'une entreprise)</li>
    </ul>
  `,
    dgccrfCountAccount: 'Nombre compte CCRF au cumul',
    dgccrfCountActiveAccount: 'Nombre compte CCRF actifs',
    dgccrfSubscriptionsCurve: `Nombre d'abonnements au cumul`,
    dgccrfControlsCurve: `Nombre d'entreprises contrôlées`,
    reportsOnFisrtProActivationAccount: `Adhésion de nouveaux professionnels`,
    reportsProUserDesc: `   
    <ul>
        <li>Nombre de signalements transmis aux professionnels (une partie des signalements relatifs aux produits dangereux, lanceurs d'alertes, démarchage téléphonique, Question pour RéponseConso ne sont pas transmis aux professionnels).</li>
        <li>Nombre d'entreprises ayant activé un compte utilisateur la première fois.</li>
    </ul>
  `,
    proFirstAccountActivation: `Nombre d'entreprises ayant activé un compte utilisateur la première fois`,
    reportsCount: 'Nombre de signalements',
    reportsCountInternet: 'Nombre de signalements internet',
    reportsCountDemarchage: 'Nombre de signalements démarchage',
    reportsCountPhysique: 'Nombre de signalements établissement physique',
    responsesCount: 'Nombre de réponses',
    emailConsumer: 'Email conso.',
    nSelected: (n: number) => `<b>${n}</b> sélectionnés`,
    consoAnonyme: 'Conso. anonyme',
    hasAttachement: `Pièces jointes`,
    reportsProProcessed: 'Traitement des signalements par les pros',
    reportsProProcessedDesc: `
    <ul>
        <li>Nombre de signalements transmis aux professionnels (certains signalements ne sont pas transmis, faute de pouvoir identifier l'entreprise, ou parce qu'elle n'est pas française)</li>
        <li>Nombre de signalements auxquels les professsionnels ont répondu
    </ul>
    Ces deux courbes sont affichées en pourcentage des signalements qu'on souhaite transmettre aux pros (on ne veut pas transmettre certains signalements relatifs aux produits dangereux, lanceurs d'alertes, ...)
    `,
    reportsProResponseType: 'Types de réponse - évolution',
    reportsProResponseTypeDesc: `   
    Répartition des réponses des professionels sur les signalements transmis
  `,
    reportsProTransmitted: '% Transmis',
    reportsProResponse: '% Réponses',
    reportsProVisibleCount: ' Nombre de signalements visibles par les pro',
    reportsProVisible: ' % Signalements visibles par les pro',
    reportsProInfonde: '% infondés',
    reportsProMalAttribue: '% mauvaises attributions',
    reportsProPromesseAction: `% promesses d'action`,
    pro: 'Professionnels',
    number: `Numéro`,
    hideAllReponseConsoAndBloctelReports: `Filtrer les signalements <b>Bloctel</b> et <b>ReponseConso</b> ?`,
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
    rank: 'Position',
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
    menu_admin: 'Administration',
    menu_stats: 'Statistiques',
    menu_exports: 'Mes exports',
    menu_users: 'Utilisateurs',
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
    reportsDistribution: `Répartition des signalements par départements`,
    reportsDistributionDesc: `Classement des signalements par départements (N/A correspond aux signalements dont les départements non renseignés).`,
    invalidSize: (maxSize: number) => `La taille du fichier dépasse les ${maxSize} Mb`,
    somethingWentWrong: `Une erreur s'est produite`,
    altLogoSignalConso: `Logo SignalConso / Retour à la page d'accueil`,
    toggleDatatableColumns: 'Afficher/Masquer des colonnes',
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
    dgccrfControlDone: 'Déclarer un contrôle',
    noAnswerFromPro: "Le professionnel n'a pas encore répondu au signalement.",
    noReviewFromConsumer: "Pas d'avis de consommateur sur la réponse du professionnel.",
    noReviewDetailsFromConsumer: "Aucun commentaire sur l'évaluation.",
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
    didTheCompanyAnsweredWell: `Est-ce que la réponse de l'entreprise vous satisfait ? <b>(Attention, une fois l'avis déposé, il ne sera plus possible de le modifier.)</b>`,
    addDgccrfComment: 'Commentaire (interne à la DGCCRF)',
    markDgccrfControlDone: 'Déclarer un contrôle (interne à la DGCCRF)',
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
    validateLetterSent: 'Valider courriers envoyés',
    emailValidated: `Votre email est validé.`,
    emailValidatedDesc: `Vous pouvez vous connecter à l'aide de votre adresse email et mot de passe.`,
    validateLetterSentTitle: "Valider l'envoi des courriers",
    sendNewPostal: `Envoyer un nouveau courrier`,
    companiesDbSyncInfo: `
    Le fichier <b>StockEtablissement</b> doit être, de préférence, lancé en premier. 
    <br/>
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
    dgccrfUsersPending: 'Agents en attente',
    consumersPending: 'Consommateurs non validés',
    lastReports: `Derniers signalements`,
    reportCloudWord: `Nuage de mots signalements`,
    cannotGenerateCloudWord: `Il n'y a pas assez de données pour générer un nuage de mots.`,
    helpCloudWord: `Nuage de mots généré à partir de la description de l'ensemble des signalements  pour l'entreprise. La taille du mot est proportionnelle à l'utilisation qui en est faite par les consommateurs dans la description des signalements. Les mots affichés correspondent à la racine du mot utilisé dans le signalement (par exemple, le mot "annul" correspond à l'utilisation de termes comme "annulé", "annulation", "annulée" et autres dérivés).`,
    invitationDate: "Date d'invitation",
    connectedUnder3Months: 'Connecté dans les 3 derniers mois',
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
    editAddress: `Modifier l'adresse`,
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
    userValidationDone: 'Le compte utilisateur a été prolongé.',
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
    extendValidation: 'Prolonger la compte.',
    authorization: `Autorisation`,
    contactAgreement: 'Accord pour contact par entreprise',
    activationDocumentRequired: `Envoyer un nouveau courrier`,
    editConsumer: 'Modifier les informations du consommateur',
    changesSaved: 'Modification enregistrée',
    selectAllDepartments: 'Tous les départements',
    positionComparedToLastMonth: `Position vs mois précédent`,
    deleteCompanyAccess: (name: string) => `Supprimer l'accès à ${name} ?`,
    deleteCompanyAccessToken: (email?: string) => `Annuler l'invitation  ${email ? 'à ' + email + ' ' : ''}?`,
    resendCompanyAccessToken: (email?: string) => `Renvoyer l'invitation  ${email ? 'à ' + email + ' ' : ''}?`,
    activateUser: (email?: string) => `Prolonger la validité du compte  ${email} ?`,
    resendInvite: `Renvoyer l'invitation`,
    copyInviteLink: `Copier le lien de l'invitation`,
    resetPasswordNotFound: `Le lien permettant de demander un nouveau mot de passe n'est pas valide, veuillez refaire une demande.`,
    resetPasswordSuccess: `Votre mot de passe est maintenant créé, vous pouvez vous connecter pour accéder à votre espace entreprise.`,
    loginIssueTip: `En cas de difficultés, vous pouvez contacter par email le service <a href="mailto:${config.contactEmail}">${config.contactEmail}</a>.`,
    consent: ` Je reconnais avoir pris connaissance des  <a href="${config.appBaseUrl}/conditions-generales-utilisation/professionnel"> conditions générales d'utilisation</a> de SignalConso.`,
    statsInternetsTitle: 'Signalements internet',
    statsInternets_all: 'des signalements sont des signalements Internet',
    statsInternets_all_desc: 'le consommateur indique que le problème rencontré concerne une entreprise en ligne',
    statsInternets_withCompany: 'pour lesquels les entreprises sont identifiées par les consommateurs',
    statsInternets_withCountry: 'pour lesquels les entreprises ne sont pas identifiées mais de pays étrangers identifiés',
    statsInternets_withCountry_desc: '(statut NA - le signalement n’est pas transmis au professionnel)',
    statsInternets_withNothing: 'pour lesquels les entreprises et le pays ne sont pas identifiés',
    statsInternets_withNothing_desc: '(statut NA - le signalement n’est pas transmis au professionnel)',
    sendDummyEmail: `Envoi d'emails tests`,
    allMailsWillBeSendTo: (email: string) =>
      `Les mails seront envoyés à l'adresse <b>${email}</b> avec de fausses données générées.`,
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
    <p>Si vous avez déjà créé votre compte, vous pouvez vous <a href="/connexion">connecter</a> à l'aide de votre adresse email et mot de passe.</p>
    Sinon, vous pouvez demander au gestionnaire de l'entreprise de vous envoyer une nouvelle invitation.
  `,
    testMails: {
      dgccrf: {
        report_notif_dgccrf: {
          title: `Abonnement`,
          desc: `Email envoyé à la suite d'un abonnement`,
        },
        report_dangerous_product_notification: {
          title: `Produit dangereux`,
          desc: `Email envoyé lors d'un nouveau signalement concernant un produit dangereux`,
        },
        access_link: {
          title: `Accéder à SignalConso`,
          desc: `Email envoyé lors de l'invitation d'un agent`,
        },
      },
      pro: {
        report_transmitted_reminder: {
          title: `Rappel signalement en attente de réponse`,
          desc: `Lorsqu'un pro a lu mais n'a pas répondu à un signalement après 7 jours`,
        },
        report_unread_reminder: {
          title: `Rappel signalement non lu`,
          desc: `Lorsqu'un pro n'a pas consulté un signalement`,
        },
        new_company_access: {
          title: `Invitation à une entreprise pour utilisateur existant`,
          desc: `Email d'invitation à rejoindre une entreprise pour un utilisateur ayant déjà un compte sur SignalConso`,
        },
        report_notification: {
          title: `Nouveau signalement`,
          desc: `Email envoyé au pro lors d'un nouveau signalement sur son entreprise`,
        },
        report_ack_pro: {
          title: `Réponse à un signalement`,
          desc: `Email envoyé lorsque le pro a répondu à un signalement, peu importe le statut`,
        },
        access_invitation: {
          title: `Invitation à une entreprise pour utilisateur sans compte`,
          desc: `Email d'invitation à rejoindre une entreprise pour un utilisateur n'ayant pas de compte sur SignalConso`,
        },
      },
      consumer: {
        report_transmitted: {
          title: `Lecture par l'entreprise`,
          desc: `Email envoyé à la fin d'un signalement`,
        },
        report_ack_pro_consumer: {
          title: `Réponse de l'entreprise`,
          desc: `Email envoyé au conso lorsque l'entreprise a répondu`,
        },
        report_ack_case_dangerous_product: {
          title: `Signalement envoyé`,
          desc: `Signalement produit dangereux`,
        },
        report_ack_case_euro_and_dispute: {
          title: `Signalement envoyé`,
          desc: `Signalement pays européen + <b>litige</b>`,
        },
        report_closed_no_action: {
          title: `Pas de réponse`,
          desc: `Email envoyé lorsque le pro n'a pas répondu au conso après le délai de 60j.`,
        },
        report_ack_case_abroad_default: {
          title: `Signalement envoyé`,
          desc: `Signalement pays étranger`,
        },
        report_ack_case_compagnie_aerienne: {
          title: `Signalement envoyé`,
          desc: `Signalement Compagnie aérienne`,
        },
        report_ack_case_suisse: {
          title: `Signalement envoyé`,
          desc: `Signalement Suisse (pays avec accord)`,
        },
        report_ack_case_dispute: {
          title: `Signalement envoyé`,
          desc: `Signalement <b>litige</b>`,
        },
        report_ack_case_andorre_and_dispute: {
          title: `Signalement envoyé`,
          desc: `Signalement Andorre (pays avec accord) + <b>litige</b>`,
        },
        report_closed_no_reading: {
          title: `Signalement non lu`,
          desc: `Email envoyé si le pro n'a pas consulté le signalement dans un délai de 60j`,
        },
        report_ack: {
          title: `Signalement envoyé`,
          desc: `Signalement aléatoire`,
        },
        report_ack_case_suisse_and_dispute: {
          title: `Signalement envoyé`,
          desc: `Signalement Suisse (pays avec accord) + <b>litige</b>`,
        },
        report_closed_no_reading_case_dispute: {
          title: `Signalement litige non lu`,
          desc: `Email envoyé si le pro n'a pas consulté le signalement de type <b>litige</b> dans un délai de 60j`,
        },
        report_closed_no_action_case_dispute: {
          title: `Signalement lu mais sans réponse`,
          desc: `Signalement <b>Litige</b>`,
        },
        report_ack_case_reponseconso: {
          title: `Signalement envoyé`,
          desc: `Question <b>ReponseConso</b>`,
        },
        report_ack_case_andorre: {
          title: `Signalement envoyé`,
          desc: `Signalement Andorre (pays avec accord)`,
        },
        report_ack_case_abroad_default_and_dispute: {
          title: `Signalement envoyé`,
          desc: `Pays étranger + <b>litige</b>`,
        },
        report_ack_case_euro: {
          title: `Signalement envoyé`,
          desc: `Pays européen`,
        },
      },
    },
    websiteEdited: 'Site web identifié.',
    alreadySelectedCompany: (name?: string) => `L'entreprise ${name ?? ''} est déjà sélectionnée`,
    alreadySelectedCountry: (name?: string) => `Le pays ${name ?? ''} est déjà sélectionnée`,
    alreadySelectedValue: (name?: string) => `La valeur ${name ?? ''} est déjà sélectionnée`,
    nLines: (n: number) => `<b>${n}</b> lignes`,
    reportResponse: {
      [ReportResponseTypes.Accepted]: 'Signalement pris en compte',
      [ReportResponseTypes.Rejected]: 'Signalement infondé',
      [ReportResponseTypes.NotConcerned]: 'Etablissement non concerné par le signalement',
    },
    responseEvaluation: {
      [ResponseEvaluation.Positive]: 'Avis positif du consommateur',
      [ResponseEvaluation.Neutral]: 'Avis mitigé du consommateur',
      [ResponseEvaluation.Negative]: 'Avis négatif du consommateur',
    },
    reportStatusShort: {
      [ReportStatus.NA]: 'NA',
      [ReportStatus.LanceurAlerte]: "Lanceur d'alerte",
      [ReportStatus.TraitementEnCours]: 'Traitement en cours',
      [ReportStatus.NonConsulte]: 'Non consulté',
      [ReportStatus.Transmis]: 'Transmis',
      [ReportStatus.PromesseAction]: `Promesse d'action`,
      [ReportStatus.Infonde]: 'Infondé',
      [ReportStatus.ConsulteIgnore]: 'Consulté ignoré',
      [ReportStatus.MalAttribue]: 'Mal attribué',
    },
    reportStatusShortPro: {
      [ReportStatusPro.NonConsulte]: 'Non consulté',
      [ReportStatusPro.ARepondre]: 'À répondre',
      [ReportStatusPro.Cloture]: 'Clôturé',
    },
    reportStatusDescPro: {
      [ReportStatusPro.NonConsulte]: 'Signalements non consultés malgré les relances',
      [ReportStatusPro.ARepondre]: 'Signalements transmis',
      [ReportStatusPro.Cloture]: "Signalements ayant fait l'objet d'une réponse ou dont le délais de réponse a expiré",
    },
    reportStatusDesc: {
      [ReportStatus.NA]: `Il y a eu un signalement déposé par un consommateur. Mais, le consommateur n’a pas pu identifier la société. Cela peut être le cas pour les sites internet et des démarchages téléphoniques ou à domicile.`,
      [ReportStatus.LanceurAlerte]: `Le signalement n’est pas envoyé au professionnel. Cela correspond aux cas où le consommateur s’est signalé comme employé du professionnel.`,
      [ReportStatus.TraitementEnCours]: `Statut intermédiaire indiquant que le signalement suit son cours et n'est pas clos. Cela correspond notamment à la période laissée au professionnel pour prendre connaissance du signalement ou y répondre.`,
      [ReportStatus.NonConsulte]: `Le professionnel n'a pas créé de compte pour lire le signalement malgré les relances.`,
      [ReportStatus.Transmis]: `Transmis`,
      [ReportStatus.PromesseAction]: `Le professionnel souhaite mettre en place une action préventive ou corrective.`,
      [ReportStatus.Infonde]: `Le professionnel a déclaré le signalement comme infondé selon lui.`,
      [ReportStatus.ConsulteIgnore]: `Le professionnel a lu le signalement, mais il n'a pas répondu malgré les relances.`,
      [ReportStatus.MalAttribue]: `Le consommateur n'a pas sélectionné le bon établissement. Il est important de rappeler que ce sont les consommateurs qui identifient le professionnel, avec un taux d’erreur d’environ 5% en pratique.`,
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
    monthShort_: {
      1: 'Jan',
      2: 'Fév',
      3: 'Mars',
      4: 'Avr',
      5: 'Mai',
      6: 'Juin',
      7: 'Juil',
      8: 'Août',
      9: 'Sept',
      10: 'Oct',
      11: 'Nov',
      12: 'Déc',
    },
    apiErrorsCode: {
      'SC-0001': `Une erreur s'est produite`,
      'SC-0002': `L'utilisateur DGCCRF n'existe pas.`,
      'SC-0003': `Le professionnel n'existe pas.`,
      'SC-0004': `L'entreprise n'existe pas.`,
      'SC-0005': `Le site web n'existe pas.`,
      'SC-0006': `L'entreprise est déjà associée à un site.`,
      'SC-0007': `URL invalide.`,
      'SC-0008': `Email DGCCRF invalide.`,
      'SC-0009': `L'utilisateur existe déjà.`,
      'SC-0010': `L'entreprise a déjà été activée.`,
      'SC-0011': `L'entreprise n'existe pas.`,
      'SC-0012': `Le code d'activation est périmé.`,
      'SC-0013': `Le code d'activation est invalide.`,
    },
  },
}
