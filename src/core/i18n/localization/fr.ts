import { formatDistance, formatDuration as formatDurationFns } from 'date-fns'
import { AssociationType } from 'feature/ReportedWebsites/SelectWebsiteIdentification/SelectWebsiteAssociation'
import { config } from '../../../conf/config'
import { DownloadType } from '../../../feature/Report/ReportDownloadAction'
import { CompanyAccessLevel } from '../../client/company-access/CompanyAccess'
import { Category } from '../../client/constant/Category'
import { EmailValidationStatus } from '../../client/consumer-email-validation/ConsumerEmailValidation'
import {
  ReportResponseTypes,
  ResponseEvaluation,
} from '../../client/event/Event'
import {
  ReportAdminActionType,
  ReportStatus,
  ReportStatusPro,
  ReportTag,
  ReportType,
} from '../../client/report/Report'
import {
  IdentificationStatus,
  InvestigationStatus,
} from '../../client/website/Website'

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
  return d!.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDateTime = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return formatDate(d) + ' à ' + formatTime(d)
}

const dateFromNow = (d?: Date): string | undefined => {
  return d ? formatDistance(d, new Date(), { addSuffix: true }) : undefined
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
    influencerIdentifiedTitle: 'Influenceur(se) identifié(e)',
    ReportCategoryDesc: {
      [Category.RetraitRappelSpecifique]: 'Retrait-Rappel spécifique',
      [Category.Coronavirus]: 'COVID-19 (coronavirus)',
      [Category.CafeRestaurant]: 'Café / Restaurant',
      [Category.AchatMagasinLegacy]: 'Achat en Magasin - ANCIENNE CATEGORIE',
      [Category.AchatMagasinInternet]:
        'Achat (Magasin ou Internet) - ANCIENNE CATEGORIE',
      [Category.AchatMagasin]: 'Achat en Magasin',
      [Category.AchatInternet]: 'Achat sur Internet',
      [Category.ServicesAuxParticuliers]: 'Services aux particuliers',
      [Category.TelEauGazElec]:
        'Téléphonie / Eau / Gaz / Electricité - ANCIENNE CATEGORIE',
      [Category.EauGazElectricite]: 'Eau / Gaz / Electricité',
      [Category.TelephonieFaiMedias]:
        "Téléphonie / Fournisseur d'accès internet / médias",
      [Category.BanqueAssuranceMutuelle]: 'Banque / Assurance / Mutuelle',
      [Category.IntoxicationAlimentaire]: 'Intoxication alimentaire',
      [Category.ProduitsObjets]: 'Produits / Objets - ANCIENNE CATEGORIE',
      [Category.Internet]: 'Internet (hors achats)',
      [Category.TravauxRenovations]: 'Travaux / Rénovation',
      [Category.VoyageLoisirs]: 'Voyage / Loisirs',
      [Category.Immobilier]: 'Immobilier',
      [Category.Sante]: 'Secteur de la santé',
      [Category.VoitureVehicule]: 'Voiture / Véhicule - ANCIENNE CATEGORIE',
      [Category.Animaux]: 'Animaux',
      [Category.DemarchesAdministratives]: 'Démarches administratives',
      [Category.VoitureVehiculeVelo]: 'Voiture / Véhicule / Vélo',
      [Category.DemarchageAbusif]: 'Démarchage abusif',
    },
    ReportTypeDesc: {
      [ReportType.Both]: 'Sites internet et établissements physiques',
      [ReportType.Internet]: 'Sites internet seulement',
      [ReportType.Shop]: 'Établissements physiques',
    },
    reportTagDesc: {
      [ReportTag.LitigeContractuel]: 'Litige contractuel',
      [ReportTag.Hygiene]: 'Hygiène',
      [ReportTag.ProduitDangereux]: 'Produit dangereux',
      [ReportTag.BauxPrecaire]: 'Baux Précaire',
      [ReportTag.DemarchageADomicile]: 'Démarchage à domicile',
      [ReportTag.DemarchageInternet]: 'Démarchage internet',
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
      [ReportTag.Resiliation]: 'Résiliation',
      [ReportTag.OpenFoodFacts]: 'OpenFoodFacts',
      [ReportTag.RappelConso]: 'RappelConso',
      [ReportTag.TransitionEcologique]: 'Transition écologique',
      [ReportTag.ProduitPerime]: 'Produit périmé',
      [ReportTag.CommandeEffectuee]: 'Commande effectuée',
      [ReportTag.ImpressionTicket]: 'Impression ticket',
      [ReportTag.QuantiteNonConforme]: 'Quantité non conforme',
      [ReportTag.AppelCommercial]: 'Appel commercial',
      [ReportTag.Prix]: 'Prix',
      [ReportTag.AlimentationMaterielAnimaux]:
        'Alimentation / Matériel pour animaux',
      [ReportTag.Telecom]: 'Télécoms',
      [ReportTag.Shrinkflation]: 'Shrinkflation',
      NA: 'Aucun tag',
    },
    IdentificationStatusDesc: {
      [IdentificationStatus.Identified]: 'Identifié',
      [IdentificationStatus.NotIdentified]: 'Non identifié',
    },
    InvestigationStatusDesc: {
      [InvestigationStatus.NotProcessed]: 'N/A',
      [InvestigationStatus.SignalConsoIdentificationFailed]:
        'Echec identification Admin',
      [InvestigationStatus.Processing]: 'Identification en cours',
    },
    websiteInvestigationClosedCompanyAssociationDesc:
      "Plusieurs sites internet associés à des entreprises fermées ont été détectés. Désormais, ces associations ne seront plus proposées aux utilisateurs. Ils devront identifier eux-mêmes l'entreprise correspondante lorsqu'ils signalent ces sites.",
    hide: 'Masquer',
    filter: 'Filtrer',
    yes: 'Oui',
    no: 'Non',
    positive:
      "Nombre d'utilisateurs satisfaits de la réponse donnée par l'entreprise",
    negative:
      "Nombre d'utilisateurs insatisfaits de la réponse donnée par l'entreprise",
    neutral:
      "Nombre d'utilisateurs partiellement satisfait de la réponse donnée par l'entreprise",
    searchByNameOrReference: 'Nom, prénom ou numéro de référence',
    activateNotificationsAlertSingle:
      "Pensez à activer les notifications dans l'onglet « Mes entreprises » afin d'être alerté par e-mail de tout nouveau signalement.",
    activateNotificationsAlertMultiple: (count: number) => `
    ${count} de vos entreprises n'ont pas les notifications actives. Activez-les dans 'Mes entreprises' pour être alerté immédiatement de tout nouveau signalement.`,
    search: 'Rechercher',
    Feedback: 'Donnez votre avis',
    edit: 'Modifier',
    next: 'Suivant',
    nextStep: 'Next step',
    close: 'Fermer',
    confirm: 'Confirmer',
    success: 'Succès',
    create: 'Créer',
    end: 'Fin',
    see: 'Voir',
    test: 'Test',
    date: 'Date',
    add: 'Ajouter',
    previous: 'Précédent',
    back: 'Retour',
    nbAttempts: 'Tentatives',
    delete: 'Supprimer',
    reOpen: 'Ré-ouvrir',
    delete_user: "Supprimer l'utilisateur",
    delete_user_desc_main: 'Vous allez supprimer un compte utilisateur.',
    delete_user_desc_details: `L'utilisateur pourra éventuellement être réinvité avec le même email. Cela créera un nouveau compte vierge, sans lien avec
    le précédent.`,
    delete_user_warning: 'Attention',
    delete_user_ask: "Supprimer l'utilisateur ?",
    delete_access: "Supprimer l'accès",
    authAttemptsHistory: 'Historique de connexion',
    delete_user_done: "L'utilisateur a été supprimé",
    operation_irreversible: 'Cette opération est irréversible !',
    deleted: 'Supprimé',
    try: 'Try',
    status: 'Statut',
    reportType: 'Type de signalement',
    identicationTools: "Outils d'identification",
    investigation: 'Enquête',
    noValue: 'N/A',
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
    textTooLarge: (maxCharSize: number) =>
      `Le nombre de caractères est limité à ${maxCharSize}`,
    cancel: 'Annuler',
    help: 'Aide',
    created_at: 'Créé le',
    ignoredReportCount: 'Signalements ignorés sous 3 mois',
    followUpCount: 'Nb relances',
    kind: "Status d'identification",
    identified: 'Identifié',
    notIdentified: 'Non identifié',
    validated: 'Validé',
    invalid: 'Non validé',
    configuration: 'Configuration',
    general: 'General',
    name: 'Nom',
    others: 'Autres',
    description: 'Description',
    deploy: 'Déployer',
    unknown: 'Inconnu',
    new: 'New',
    start: 'Début',
    failureCause: `Cause de l'échec`,
    clear: 'Clear',
    cron: 'Cron',
    removeAsk: 'Supprimer ? ',
    cannotUpdateWebsiteStatus:
      'La validation nécéssite que le site soit identifié par une entreprise ou un pays',
    thisWillBeRemoved: (_: string) =>
      `La pièce jointe <b>${_}</b> sera définitivement supprimée.`,
    exportInXLS: 'Exporter en XLS',
    removeAllFilters: 'Supprimer les filtres',
    reOpenReportDesc: `Voulez-vous vraiment ré-ouvrir le signalement ?`,
    download: 'Télécharger',
    downloadAll: 'Tout télécharger',
    downloadNotice: 'Télécharger le courrier',
    remainingTime: 'Temps restant',
    forgottenPassword: 'Mot de passe oublié ?',
    forgottenPasswordDesc:
      'Vous recevrez un email vous permettant de créer un nouveau mot de passe.',
    createNewPassword: 'Créer un nouveau mot de passe',
    speed: 'Speed',
    key: 'Key',
    value: 'Value',
    invite: 'Inviter',
    invite_admin: 'Inviter un admin',
    invite_agent: 'Inviter un agent',
    add_email_to_blacklist: 'Ajouter un email à la liste noire',
    activate_all: 'Tout Activer',
    block_all: 'Tout Bloquer',
    parameters: 'Paramètres',
    startedAt: 'Démarré le',
    startedBy: 'Démarré le',
    receivedAt: 'Reçu le',
    expireOn: 'À répondre avant le',
    warnExpireOn: (date: String) => `Expire le ${date}`,
    pin: `Épingler`,
    endedAt: 'Terminé le',
    anonymous: 'Anonyme',
    active: 'Actif',
    inactive: 'Non actif',
    seeMore: 'Voir plus',
    apiToken: 'Api token',
    login: 'Connexion',
    imLoggingIn: 'Je me connecte',
    error: 'Erreur',
    email: 'Email',
    yourEmail: 'Votre adresse email',
    signin: 'Connexion',
    signup: 'Inscription',
    password: 'Mot de passe',
    logout: 'Déconnexion',
    home: 'Accueil',
    theConsumer: 'Le consommateur',
    consumer: 'Consommateur',
    company: 'Entreprise',
    association: 'Association',
    country: 'Pays',
    companyWebsiteAssociation: `Association du site internet`,
    reportAssociation: `Associer une entreprise ou un pays`,
    address: 'Adresse',
    imCreatingMyAccount: 'Je crée mon compte',
    createMyAccount: 'Créer mon compte',
    accountCreation: 'Création de compte',
    accountAlmostReady: 'Votre compte est (presque) prêt',
    finishCreatingMyAccount: 'Terminer la création de mon compte',
    invalidEmail: 'Email invalide',
    role: 'Rôle',
    firstName: 'Prénom',
    lastName: 'Nom',
    attachTo: `Attacher à`,
    attachToType: {
      [AssociationType.COMPANY]: `Une entreprise`,
      [AssociationType.COUNTRY]: `Un pays étranger`,
    },
    addCompany: `Ajouter l'entreprise`,
    addACompany: `Ajouter une entreprise`,
    youReceivedNewLetter: `Activation par courrier postal`,
    siretOfYourCompany: `SIRET de votre entreprise`,
    siretOfYourCompanyDesc: `Renseignez le numéro SIRET mentionné dans le courrier que vous avez reçu.`,
    siretOfYourCompanyInvalid: `Le SIRET doit comporter 14 chiffres.`,
    siretExample: 'ex : 12002503600035', // c'est le siret de la DGCCRF
    activationCode: `Code d'activation`,
    activationCodeDesc: `Code à 6 chiffres indiqué dans le courrier que vous avez reçu.`,
    promisedAction:
      'Vous venez de faire une promesse d’action et nous vous en félicitons !',
    claimDeemedUnfounded: 'Vous avez estimé que ce signalement était infondé.',
    claimNotConcernedYourEstablishment:
      'Vous avez estimé que ce signalement ne concernait pas votre établissement.',
    responseSentToConsumer:
      'Nous avons envoyé votre réponse au consommateur. Elle est également visible par la DGCCRF.',
    consumerReviewInvitationForAccepted: (days: number) =>
      `Le consommateur sera invité à donner son avis sur votre réponse et les actions mises en œuvre dans un délai de ${days} jours.`,
    consumerReviewInvitation:
      'Le consommateur sera invité à donner son avis sur votre réponse dès sa réception.',
    activationCodeInvalid: `Le code doit comporter 6 chiffres.`,
    activationCodeExample: 'ex : 123456',
    emailDesc: `Adresse email de votre choix.`,
    willReceiveVerificationEmail:
      'Vous allez recevoir un email de vérification à cette adresse.',
    willUseThisEmailToCommunicate: `C'est via cette adresse email que SignalConso communiquera avec vous désormais`,
    newReportsWillBeSentThere: `S'il y a des nouveaux signalements concernant votre entreprise, ils vous seront notifiés à cette adresse.`,
    willUseItToConnect: `C'est avec cette adresse email que vous vous connecterez à l'Espace Pro pour consulter vos signalements.`,
    activityCode: `Code d'activité`,
    days: `jours`,
    avgResponseTime: `Temps de réponse moyen`,
    avgResponseTimeDesc: `Sur les signalements ayant obtenu une réponse.`,
    avgResponseTimeDescNoData: `Aucun signalement n'a obtenu de réponse pour le moment`,
    selectedPeriod: 'Période sélectionnée',
    department: 'Département',
    url: 'URL',
    companyRegistered: 'Entreprise enregistrée',
    companyRegisteredSuccess: 'Activation réussie',
    companyRegisteredEmailSent: `
        <br/>
        <p >Un email a été envoyé à votre adresse email avec des instructions pour terminer la création du compte. </p>
        <br/>
        <p><b>Vérifiez vos spams</b> s'il n'apparaît pas dans votre boîte de réception. Si vous ne le recevez toujours pas, contactez <u><a href='mailto:${config.contactEmail}'>${config.contactEmail}</a></u> en indiquant bien <b>votre adresse email et votre numéro SIRET</b>.</p>
    `,
    departments: 'Départements',
    reports: 'Signalements',
    see_reports: 'Voir les signalements',
    myStats: 'Statistiques',
    responseRate: '% réponse',
    report: 'Signalement',
    you: 'Vous',
    reportHistory: 'Historique du signalement',
    reportedWebsites: 'Suivi des sites internet',
    reportedCompaniesWebsites: 'Associations sites / entreprises',
    websitesInvestigation: 'Identification des sites',
    showLabels: 'Afficher les valeurs :',
    reportedUnknownWebsites: 'Sites non identifiés',
    reportedUnknownWebsitesDGCCRF: 'Suivi des sites internet non identifiés',
    companyHistory: "Historique de l'entreprise",
    reports_pageTitle: 'Suivi des signalements',
    OpenReports_pageTitle: 'Suivi des signalements à traiter',
    ClosedReports_pageTitle: 'Suivi des signalements clôturés',
    notificationsAreDisabled: `Inclus les notifications concernant les signalements des entreprises.`,
    notificationSettings: `Emails reçus lors d'un nouveau signalement.`,
    notificationAcceptForCompany:
      "Autoriser l'envoi d'emails concernant les signalements d'une entreprise.",
    notificationDisableWarning: `Désactiver les notifications`,
    notificationDisableWarningDesc: `Attention, si vous désactivez les notifications, vous ne recevrez plus les nouveaux signalements par mail. Vous devrez vous connecter régulièrement sur votre espace pour consulter les nouveaux signalements.`,
    report_pageTitle: `Signalement`,
    details: 'Détails',
    answer: 'Répondre',
    responseToConsumer: 'Votre réponse au consommateur',
    responseToDGCCRF: 'Précisions pour la DGCCRF',
    invitNewUser: 'Inviter un nouvel utilisateur',
    editPassword: 'Modification du mot de passe',
    editName: 'Modification du nom',
    editEmail: "Modification de l'email",
    editPasswordDesc: 'Changez votre mot de passe.',
    editEmailDesc: 'Changez votre email.',
    emailAddressUpdated: 'Votre adresse email a bien été changé !',
    emailAddressUpdatedToast: 'Adresse email modifiée avec succès !',
    updateEmailSentTo: "Email de changement d'adresse email envoyé à :",
    updateEmailAlert1: 'Votre email ne sera pas modifié immédiatement',
    updateEmailAlert2:
      'Vous recevrez un email à votre nouvelle adresse pour la confirmer. Cliquez sur le lien dans cet email pour valider et modifier votre adresse.',
    reportNeedsAnswerBefore: 'A répondre avant le',
    reportProMustAnswerBefore: 'Le pro doit répondre avant le',
    reportProHadToAnswerBefore: 'Le pro devait répondre avant le',
    reportLimitedTimeToAnswer:
      "Vous n'avez plus beaucoup de temps pour répondre à ce signalement !",
    reportCategoriesAreSelectByConsumer:
      'Les catégories du signalement sont sélectionnées par le consommateur.',
    reportNotTransmittable:
      "Ce signalement n'a pas été transmis et ne doit pas être transmis au professionnel.",
    reportConsumerWantToBeAnonymous: 'Le consommateur souhaite rester anonyme',
    reportConsumerReferenceNumber: 'Numéro de référence',
    reportConsumerReferenceNumberDesc:
      'Numéro de billet, ou de réservation, de facture, de contrat, de client, etc.',
    marketplaceVendorDesc: (marketplace: string) =>
      `Le signalement concerne un vendeur sur la marketplace ${marketplace} `,
    marketplaceVendorTitle: 'Vendeur marketplace',
    cannotExportMoreReports: (reportCount: number) =>
      `Impossible d'exporter plus de ${reportCount} signalements.`,
    siret: 'SIRET',
    siretOrSiren: 'SIRET ou SIREN',
    siretOrSirenFound: 'SIRET/SIREN identifié',
    postalCodeShort: 'CP',
    files: 'Fichiers',
    problem: 'Problème',
    creation: 'Création',
    creationDate: 'Date de création',
    firstReportDate: 'Date du 1er signalement',
    addedDate: "Date d'ajout",
    lastUpdated: 'Dernière modification',
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
    statsLandingPage: 'Statistiques de SignalConso',
    statsCountBySubCategoriesTab: 'Signalements par sous catégories',
    statsCountBySubCategories:
      'Nombre de signalements par sous catégories (signalements en français)',
    statsCountBySubCategoriesForeign:
      'Nombre de signalements par sous catégories (signalements étrangers)',
    expandAll: 'Tout déplier',
    dateFilters: 'Filtrer par dates',
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
        <li>Nombre de signalements transmis aux professionnels (certains signalements n'ont pas vocation à être transmis, par exemple ceux relatifs aux produit dangereux. D'autres ne peuvent être transmis, par exemple si l'entreprise n'a pu être identifiée)</li>
        <li>Nombre d'entreprises ayant activé un compte utilisateur la première fois.</li>
    </ul>
  `,
    proFirstAccountActivation: `Nombre d'entreprises ayant activé un compte utilisateur la première fois`,
    reportsCount: 'Nombre de signalements',
    reportsCountInternet: 'Nombre de signalements internet',
    reportsCountDemarchage: 'Nombre de signalements démarchage',
    reportsCountPhysique: 'Nombre de signalements établissement physique',
    reportsCountInfluenceurs: 'Nombre de signalements influenceurs',
    responsesCount: 'Nombre de réponses',
    emailConsumer: 'Email conso.',
    nSelected: (n: number) => `<b>${n}</b> sélectionnés`,
    consoAnonyme: 'Conso. anonyme',
    hasAttachement: `Pièces jointes`,
    reportsProProcessed: 'Traitement des signalements par les professionnels',
    reportsProProcessedDesc: `
    <ul>
        <li>Nombre de signalements transmis aux professionnels (certains signalements ne sont pas transmis, faute de pouvoir identifier l'entreprise, ou parce qu'elle n'est pas française)</li>
        <li>Nombre de signalements auxquels les professsionnels ont répondu
    </ul>
    Ces deux courbes sont affichées en pourcentage des signalements qu'on souhaite transmettre aux pros (on ne veut pas transmettre certains signalements relatifs aux produits dangereux, informateurs dans l'entreprise, ...)
    `,
    reportsProProcessedInfo: `Les chiffres des 2-3 derniers mois peuvent encore augmenter, au fur et à mesure que les professionnels traitent leurs signalements`,
    reportsProResponseType: 'Types de réponse - évolution',
    reportsProResponseTypeDesc: `   
    Répartition des réponses des professionels sur les signalements transmis
  `,
    reportsProTransmitted: '% Transmis',
    reportsProResponse: '% Réponses',
    reportsProTransmittedCount:
      'Nombre de signalements transmis aux professionnels',
    reportsProInfonde: '% infondés',
    reportsProMalAttribue: '% mauvaises attributions',
    reportsProPromesseAction: `% promesses d'action`,
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
    menu_open_reports: 'Signalements à traiter',
    menu_closed_report: `Signalements clôturés`,
    menu_engagements_report: `Mes engagements`,
    menu_companies: 'Entreprises',
    menu_my_companies: 'Mes entreprises',
    menu_admin_tools: `Outils`,
    menu_stats: 'Statistiques',
    menu_exports: 'Mes exports',
    menu_users: 'Utilisateurs',
    menu_subscriptions: 'Abonnements',
    menu_settings: 'Paramètres',
    menu_join_informations: 'Informations',
    category: 'Catégorie',
    myCompanies: 'Mes entreprises',
    returnDate: 'Date du retour courrier',
    proResponse: 'Réponse du professionnel',
    foreignReport: 'Signalement étranger',
    searchByEmail: 'Rechercher par email',
    undeliveredDoc: 'Courrier retourné ?',
    undeliveredDocTitle: 'Indiquer un courrier retourné',
    searchByHost: 'Rechercher par nom de domaine',
    addProAttachmentFile: "Ajouter une pièces jointe fournie par l'entreprise",
    addAttachmentFile: 'Ajouter une pièces jointe',
    attachedFiles: 'Pièces jointes',
    reportsDistribution: `Répartition des signalements par départements`,
    reportsDistributionDesc: `Classement des signalements par départements (N/A correspond aux signalements dont les départements non renseignés).`,
    invalidSize: (maxSize: number) =>
      `La taille du fichier dépasse les ${maxSize} Mb`,
    somethingWentWrong: `Une erreur s'est produite`,
    altLogoSignalConso: `Logo SignalConso / Retour à la page d'accueil`,
    toggleDatatableColumns: 'Afficher/Masquer des colonnes',
    altLogoGouv: `Logo Gouvernement - Ministère de l'Economie, des Finances et de la Relance`,
    altLogoDGCCRF: `Logo DGCCRF - Direction générale de la Concurrence, de la Consommation et de la Répression des fraudes`,
    noAttachment: 'Aucune pièce jointe.',
    reportDgccrfDetails: 'Informations complémentaires pour la DGCCRF :',
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
    proAnswerVisibleByDGCCRF:
      'Votre réponse sera visible par le consommateur et la DGCCRF.',
    proAnswerYourAnswer: 'Votre réponse',
    text: 'Votre texte',
    onlyVisibleByDGCCRF: `Visibles uniquement par la <b>DGCCRF</b>. <span class='text-red-600 font-bold'>Elles ne seront jamais transmises au consommateur.</span>`,
    proAnswerYourAnswerDesc: `
    <b>Le consommateur</b> la recevra par mail. Elle pourra aussi être consultée par la <b>DGCCRF</b>.<br/>
    Nous vous demandons de rester courtois dans votre réponse. Les menaces et insultes n'ont pas leur place dans SignalConso !
  `,
    proAnswerYourDGCCRFAnswer: 'Informations complémentaires',
    proAnswerYourDGCCRFAnswerDesc: `
    Ces précisions sont à <b>l'attention de la DGCCRF</b>. Elles ne seront pas transmises au consommateur.
  `,
    proAnswerSent:
      'Votre réponse a été envoyée au consommateur. Elle sera aussi consultable par la DGCCRF.',
    reportResponseDesc: {
      [ReportResponseTypes.Accepted]: 'Je propose une solution',
      [ReportResponseTypes.Rejected]: "J'estime que ce signalement est infondé",
      [ReportResponseTypes.NotConcerned]:
        "J'estime que ce signalement ne concerne pas mon établissement",
    },
    selectAll: `Tout sélectionner`,
    advancedFilters: 'Filtres avancés',
    comment: 'Commentaire',
    commentAdded: 'Commentaire ajouté',
    actionDone: 'Action effectuée avec succès',

    dgccrfControlDone: 'Déclarer un contrôle',
    noAnswerFromPro: "Le professionnel n'a pas encore répondu au signalement.",
    noReviewFromConsumer:
      "Le consommateur n'a pas encore donné son avis sur cette réponse.",
    noReviewDetailsFromConsumer:
      "Le consommateur n'a pas laissé de commentaire pour la DGGCRF.",
    companiesSearchPlaceholder: 'Rechercher par nom, SIREN, SIRET...',
    companySearch: 'Rechercher une entreprise',
    emailValidation: `Validation de l'adresse email`,
    anonymousReport: 'Signalement anonyme',
    send: `Envoyer`,
    responses: 'Réponses',
    informations: `Informations`,
    reviews: `Avis`,
    consumerReviews: `Avis consommateur sur les réponses`,
    companySearchLabel: 'SIREN, SIRET ou RCS',
    accountActivated: 'Compte activé',
    accountsActivated: `comptes activés`,
    companiesToActivate: "En attente d'activation",
    companiesToFollowUp: 'Entreprises inactives',
    companiesToActivateDesc:
      "Cette page liste les entreprises auquel il faudrait envoyer un courrier d'activation.",
    companiesToFollowUpDesc:
      'Cette page liste les entreprises qui ne consultent plus leurs signalements sur une période de 3 mois, mais qui ont un compte enregistrant au moins une connexion.',
    companiesToFollowUpDescDetail:
      "Il s'agit de relancer ces entreprises qui pourraient avoir perdu l'accès à leur compte (par exemple, un utilisateur qui quitterait l'entreprise, etc.). Une fois le courrier marqué comme envoyé, l'entreprise est considérée comme relancée et disparaîtra de cette liste. Si elle ignore toujours les signalements, elle pourrait réapparaître dans 3 mois.",
    companiesToActivateDescDetail:
      "Il peut s'agir de leur premier courrier, ou d'un courrier de relance.",
    activationFailed:
      "Erreur inattendue , impossible d'activer le compte. Merci de bien vouloir réessayer ultérieurement.",
    companiesActivated: 'Entreprises identifiées',
    noCompanyFound: 'Aucune entreprise trouvée',
    isHeadOffice: 'Siège social',
    activationDocReturned: `courriers retournés`,
    proTheatToConsumer: `menaces du pro pour suppression`,
    proTheatToConsumerDesc: `Nombre de suppressions de signalements à la demande d'un consommateur suite à une menace d'un professionnel.`,
    proRefundBlackMail: `chantages au remboursement`,
    proRefundBlackMailDesc: `Nombre de signalements supprimés à la demande d'un consommateur en raison d'un chantage au remboursement par un professionnel`,
    shareYourReview: `Donner votre avis`,
    thanksForSharingYourReview: `Votre avis a bien été pris en compte, nous vous en remercions.`,
    didTheCompanyAnsweredWell: `Est-ce que la réponse de l'entreprise vous satisfait ? <b>(Attention, une fois l'avis déposé, il ne sera plus possible de le modifier.)</b>`,
    addDgccrfComment: 'Commentaire (interne à la DGCCRF)',
    administratorAction: 'Action administrateur',
    reportReopening: 'Réouverture du signalement',
    markDgccrfControlDone: 'Déclarer un contrôle (interne à la DGCCRF)',
    thisDate: (_: string) => `Le ${_}`,
    byHim: (_: string) => `Par ${_}`,
    copyAddress: `Copier l'adresse`,
    succesCopy: `Adresse copiée`,
    errorCopy: `Échec de la copie`,
    youCanAddCommentForDGCCRF: `Vous pouvez, si vous le souhaitez, apporter une précision <b>à l'attention de la DGCCRF</b> qui ne sera pas transmise à l'entreprise`,
    youCanRateSignalConso: `Je recommande SignalConso :`,
    addressCopied: `Adresse copiée`,
    governmentCompany: 'Administration publique',
    closedCompany: 'Établissement fermé (non sélectionnable)',
    registerACompany: 'Enregistrer une entreprise',
    noDataAtm: 'Aucune donnée',
    linkNotValidAnymore: `Le lien sur lequel vous avez cliqué n'est plus valide.`,
    linkNotValidAnymoreDesc: `Si vous avez déjà validé votre email, vous pouvez vous connecter à l'aide de votre adresse email et mot de passe.`,
    noReportsTitle: 'Aucun signalement',
    noReportsDesc: 'Aucun signalement ne correspond à votre recherche.',
    noReportsAtAllTitle: `Aucun signalement`,
    noReportsAtAllDesc: `Vous avez répondu à tous vos signalements !`,
    noReportsAtCloseTitle: `Aucun signalement`,
    noReportsAtCloseDesc: `Vous n'avez aucun signalement clôturé`,
    lastNotice: 'Relancé le',
    validatingEmail: `Validation de l'adresse email...`,
    markNoticesSent: 'Marquer courriers envoyés',
    emailValidated: `Votre email est validé.`,
    emailValidatedDesc: `Vous pouvez vous connecter à l'aide de votre adresse email et mot de passe.`,
    validateLetterSentTitle: "Valider l'envoi des courriers",
    sendNewPostal: `Envoyer un nouveau courrier`,
    loginForbidden: `Compte bloqué (trop de tentatives, veuillez réessayer dans 30 minutes)`,
    loginLocked: `Votre adresse email doit être validée, un e-mail vient de vous être envoyé avec un lien à cet effet.`,
    loginFailed: `Échec de l'authentification`,
    companyActivationNotFound: `Le SIRET ou le code d'activation est invalide.`,
    validateLetterSentDesc:
      'Les courriers seront considérés envoyés pour les entreprises sélectionnées. Cette action est irrévocable.',
    agentUsers: 'Agents',
    agentUsersPending: 'Agents en attente',
    adminUsers: 'Admins',
    consumersPending: 'Consos non validés',
    authAttempts: 'historique de connexion',
    blacklistedConsumers: 'Liste noire des consos',
    lastReports: `Derniers signalements`,
    reportCloudWord: `Top 10 des mots les plus fréquents`,
    cannotGenerateCloudWord: `Il n'y a pas assez de données pour générer une liste de mots.`,
    helpCloudWord: `Classement de mots généré à partir de la description de l'ensemble des signalements  pour l'entreprise. Le nombre d'occurences du mot est proportionnelle à l'utilisation qui en est faite par les consommateurs dans la description des signalements. Les mots affichés correspondent à la racine du mot utilisé dans le signalement (par exemple, le mot "annul" correspond à l'utilisation de termes comme "annulé", "annulation", "annulée" et autres dérivés).`,
    invitationDate: "Date d'invitation",
    connectedUnder3Months: 'Connecté dans les 3 derniers mois',
    users_invite_dialog_title_agent: 'Inviter un agent',
    users_invite_dialog_title_admin: 'Inviter un administrateur SignalConso',
    enableAll: `Tout activer`,
    disable: `Désactiver`,
    disableAll: `Tout désactiver`,
    add_email_to_blacklist_desc: 'Cet email sera ajouté à la liste.',
    add_email_to_blacklist_desc_alert:
      'Les signalements envoyés en utilisant cet email ne seront plus enregistrés.',
    users_invite_dialog_desc_agent:
      "Un courrier électronique sera envoyé à l'adresse e-mail saisie ci-dessus avec un lien sécurisé permettant de créer un compte DGCCRF / DGAL.",
    users_invite_dialog_desc_admin:
      "Un courrier électronique sera envoyé à l'adresse e-mail saisie ci-dessus avec un lien sécurisé permettant de créer un compte administrateur SignalConso.",
    users_invite_dialog_alert_admin:
      "Cet utilisateur aura les droits ADMINISTRATEUR sur l'ensemble de SignalConso !",
    selectedCompanies: `entreprises sélectionnées`,
    passwordShouldBeLongAnd:
      'Le mot de passe doit faire au moins 12 caractères, et contenir au moins :',
    anUppercaseLetter: 'une majuscule',
    aLowercaseLetter: 'une minuscule',
    aNumber: 'un chiffre',
    aSpecialChar: 'un caractère spécial (%, !, @, etc.)',
    passwordNeedToContainLowercase:
      'Le mot de passe doit contenir au moins une lettre minuscule',
    passwordNeedToContainUppercase:
      'Le mot de passe doit contenir au moins une lettre majuscule',
    passwordNeedToContainNumber:
      'Le mot de passe doit contenir au moins un chiffre',
    passwordNeedToContainSpecialChar:
      'Le mot de passe doit contenir un caractère spécial',
    passwordNeedToBeLong: '12 caractères minimum',
    oldPassword: 'Ancien mot de passe',
    companyCreated: 'Entreprise créée',
    codeNaf: 'Code NAF',
    cannotCreateCompanyMissingInfo: `Impossible de créer l'entreprise. Son nom ou son adresse ne sont pas renseignés.`,
    editAddress: `Modifier l'adresse`,
    reportDownloadTypeDescription: {
      [DownloadType.ReportOnly]:
        'Téléchargement de la fiche de signalement uniquement.',
      [DownloadType.ReportWithAttachment]:
        'Téléchargement de la fiche de signalement et des pièces jointes associées.',
    },
    reportDownload: 'Que voulez-vous télécharger ?',
    reportDownloadTypeTitle: {
      [DownloadType.ReportOnly]: 'Signalement uniquement',
      [DownloadType.ReportWithAttachment]: 'Signalement et pièces jointes',
    },
    companyAccessLevelDescription: {
      [CompanyAccessLevel.admin]:
        'Peut  consulter, répondre aux signalements et inviter/supprimer des nouveaux utilisateurs.',
      [CompanyAccessLevel.member]:
        'Peut consulter et répondre aux signalements.',
    },
    reportDeletionTypeDescription: {
      [ReportAdminActionType.ConsumerThreatenByPro]:
        'Le consommateur est victime de menaces de la part du professionnel et souhaite supprimer son signalement par crainte de représailles. Le signalement ne sera plus visible sur la plateforme.',
      [ReportAdminActionType.RefundBlackMail]:
        "Le consommateur demande la suppression du signalement en raison d'un chantage de la part du professionnel pour la résolution de son litige. Le signalement ne sera plus visible sur la plateforme.",
      [ReportAdminActionType.OtherReasonDeleteRequest]:
        'Le consommateur exprime le souhait de retirer son signalement de notre plateforme sans donner de raisons particulières. Le signalement ne sera plus visible sur la plateforme.',
      [ReportAdminActionType.SolvedContractualDispute]:
        "Le consommateur nous informe que le litige a été réglé en dehors de la plateforme. Le signalement passera au statut 'Promesse d'action' puis le consommateur et le professionnel seront informés par email de la clôture du signalement.",
    },
    reportDeletionTypeName: {
      [ReportAdminActionType.ConsumerThreatenByPro]:
        'Suppression suite à la menace du pro',
      [ReportAdminActionType.RefundBlackMail]:
        'Supression suite au chantage du pro',
      [ReportAdminActionType.OtherReasonDeleteRequest]: 'Autre suppression',
      [ReportAdminActionType.SolvedContractualDispute]:
        'Résolution du signalement hors SignalConso',
    },
    invitationToProAlreadySent: (email: string) =>
      `Une invitation a déjà été envoyée à l'adresse ${email}.`,
    editedAddress: `Adresse modifiée`,
    failedToChangePassword: 'Impossible de modifier le mot de passe.',
    passwordAreIdentical: 'Les mots de passe sont identiques',
    passwordDoesntMatch: "Le mot de passe n'est pas identique",
    passwordEdited: 'Mot de passe modifié.',
    invalidPassword: 'Mot de passe incorrect',
    newPassword: 'Nouveau mot de passe',
    passwordChange: 'Changement de mot de passe',
    subscription: 'Abonnement',
    emailSentToYou: 'Un email vous a été envoyé.',
    removeSubscription: "Supprimer l'abonnement",
    unblockConsumer: 'Retirer cet email de la liste noire',
    newPasswordConfirmation: 'Confirmer le nouveau mot de passe',
    userInvitationSent: 'Invitation envoyée',
    userInvitationsSent: 'Invitations envoyée',
    added: 'Ajouté',
    userValidationDone: 'Le compte utilisateur a été prolongé.',
    companyAccessLevel: 'Autorisation',
    editAccess: `Modifier l'accès`,
    emailAdminValidation:
      'Email invalide. Emails acceptés : *@dgccrf.finances.gouv.fr, ou *@beta.gouv.fr, ou *.betagouv@gmail.com, ou *.betagouv+suffixe@gmail.com',
    emailDGCCRFValidation: 'Email invalide. Emails acceptés : *.gouv.fr',
    emailDGALValidation: 'Email invalide. Emails acceptés : *.gouv.fr',
    companyAccessesTitle: 'Gestion des accès',
    daily: 'Quotidienne',
    yourAccountIsActivated: `Votre compte est bien activé, vous pouvez consulter vos signalements.`,
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
    deleteCompanyAccess: (name: string) =>
      `Supprimer l'accès à cette entreprise pour ${name} ?`,
    deleteCompanyAccessToken: (email?: string) =>
      `Annuler l'invitation  ${email ? 'à ' + email + ' ' : ''}?`,
    resendCompanyAccessToken: (email?: string) =>
      `Renvoyer l'invitation  ${email ? 'à ' + email + ' ' : ''}?`,
    activateUser: (email?: string) =>
      `Prolonger la validité du compte  ${email} ?`,
    resendInvite: `Renvoyer l'invitation`,
    copyInviteLink: `Copier le lien de l'invitation`,
    resetPasswordNotFound: `Le lien permettant de demander un nouveau mot de passe n'est pas valide, veuillez refaire une demande.`,
    resetPasswordSuccess: `Votre mot de passe a été changé. Vous pouvez vous connecter avec votre nouveau mot de passe.`,
    loginIssueTip: `En cas de difficultés, vous pouvez nous demander de l'aide par email à <a href='mailto:${config.contactEmail}'>${config.contactEmail}</a>.`,
    consent: ` Je reconnais avoir pris connaissance des  <a href='${config.appBaseUrl}/conditions-generales-utilisation'> conditions générales d'utilisation</a> de SignalConso.`,
    statsInternetsTitle: 'Signalements internet',
    statsInternets_all: 'des signalements sont des signalements Internet',
    statsInternets_all_desc:
      'le consommateur indique que le problème rencontré concerne une entreprise en ligne',
    statsInternets_withCompany:
      'pour lesquels les entreprises sont identifiées par les consommateurs',
    statsInternets_withCountry:
      'pour lesquels les entreprises ne sont pas identifiées mais de pays étrangers identifiés',
    statsInternets_withCountry_desc:
      '(statut NA - le signalement n’est pas transmis au professionnel)',
    statsInternets_withNothing:
      'pour lesquels les entreprises et le pays ne sont pas identifiés',
    statsInternets_withNothing_desc:
      '(statut NA - le signalement n’est pas transmis au professionnel)',
    sendDummyEmail: `Envoi d'emails de test`,
    downloadDummyPdfs: `Téléchargements de PDFs de test`,
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
    <p>Si vous avez déjà créé votre compte, vous pouvez vous <a href='/connexion'>connecter</a> à l'aide de votre adresse email et mot de passe.</p>
    Sinon, vous pouvez demander au gestionnaire de l'entreprise de vous envoyer une nouvelle invitation.
  `,
    testMails: {
      divers: {
        reset_password: {
          title: `Réinitialiser le mot de passe`,
          desc: `Email envoyé lors de la demande de réinitialiser le mot de passe`,
        },
        update_email_address: {
          title: `Valider la nouvelle adresse email `,
          desc: `Email envoyé lors de la demande de changement d'adresse email`,
        },
      },
      admin: {
        access_link: {
          title: `Invitation accès Administrateur`,
          desc: `Email envoyé de l'invitation de quelqu'un pour qu'il puisse se créer un compte Admin sur SignalConso`,
        },
        probe_triggered: {
          title: `Déclenchement d'une sonde`,
          desc: `Email envoyé lorsque notre système de sondes automatiques détecte un bug potentiel`,
        },
      },
      dgccrf: {
        report_notif_dgccrf: {
          title: `Abonnement`,
          desc: `Email envoyé à la suite d'un abonnement`,
        },
        report_dangerous_product_notification: {
          title: `Produit dangereux`,
          desc: `Email envoyé lors d'un nouveau signalement concernant un produit dangereux`,
        },
        priority_report_notification: {
          title: `Notification de signalement 'prioritaire'`,
          desc: `Email envoyé lors d'un nouveau signalement validant certains critères (ex: Shrinkflation)`,
        },
        access_link: {
          title: `Accéder à SignalConso`,
          desc: `Email envoyé lors de l'invitation d'un agent`,
        },

        validate_email: {
          title: `Valider l'email`,
          desc: `Email envoyé lorsque l'email de l'agent n'a pas été validé depuis un certain temps`,
        },
        inactive_account_reminder: {
          title: `Rappel de compte inactif`,
          desc: `Email envoyé lorsque le compte est inactif depuis un certain temps. Rappel avant suppression définitive`,
        },
      },
      pro: {
        reports_transmitted_reminder: {
          title: `Rappel signalements en attente de réponse`,
          desc: `Lorsqu'un pro a lu mais n'a pas répondu à un ou plusieurs signalements après 7 jours`,
        },
        reports_unread_reminder: {
          title: `Rappel signalements non lu`,
          desc: `Lorsqu'un pro n'a pas consulté un ou plusieurs signalements`,
        },
        new_company_access: {
          title: `Invitation à une entreprise pour utilisateur existant`,
          desc: `Email d'invitation à rejoindre une entreprise pour un utilisateur ayant déjà un compte sur SignalConso`,
        },
        new_companies_accesses: {
          title: `Invitation à plusieurs entreprises pour utilisateur existant`,
          desc: `Email envoyé lors d'un import de masse (bouton "Importer" dans l'onglet des "Entreprises identifiées"), si l'utilisateur a déjà un compte`,
        },
        report_notification: {
          title: `Nouveau signalement`,
          desc: `Email envoyé au pro lors d'un nouveau signalement sur son entreprise`,
        },
        report_ack_pro: {
          title: `Réponse à un signalement`,
          desc: `Email envoyé lorsque le pro a répondu à un signalement, peu importe le statut`,
        },
        report_ack_pro_on_admin_completion: {
          title: `Signalement résolu en dehors de SignalConso`,
          desc: `Email envoyé lorsqu'un admin marque un signalement comme résolu en dehors de SignalConso (dans le menu "Action Administrateur")`,
        },
        access_invitation: {
          title: `Invitation à une entreprise pour utilisateur sans compte`,
          desc: `Email d'invitation à rejoindre une entreprise pour un utilisateur n'ayant pas de compte sur SignalConso`,
        },
        access_invitation_multiple_companies: {
          title: `Invitation à rejoindre plusieurs entreprises`,
          desc: `Email envoyé lors de l'utilisation d'un import de masse (bouton "Importer" dans l'onglet des "Entreprises identifiées")`,
        },
        report_reopening_notification: {
          title: `Réouverture du signalement`,
          desc: `Email de ré-ouverture du signalement suite à la demande du pro`,
        },
        report_assignement_to_other: {
          title: `Affectation du signalement`,
          desc: `Email envoyé quand un signalement a été affecté au pro par un de ses collègues. Il n'est pas envoyé s'il se l'est affecté lui-même`,
        },
      },
      consumer: {
        report_pro_engagement_review: {
          title: `Engagement de l'entreprise`,
          desc: `Email envoyé au conso plusieurs jours après la promesse d'action du pro pour lui demander si il a bien tenu son engagement`,
        },
        report_deletion_confirmation: {
          title: `Signalement supprimé`,
          desc: `Email envoyé lorsqu'un admin supprime le signalement (dans le menu "Action Administrateur", quel que soit le motif choisi)`,
        },
        report_transmitted: {
          title: `Lecture par l'entreprise`,
          desc: `Email envoyé à la fin d'un signalement`,
        },
        report_ack_pro_consumer: {
          title: `Réponse de l'entreprise`,
          desc: `Email envoyé au conso lorsque l'entreprise a répondu`,
        },
        report_ack_pro_consumer_on_admin_completion: {
          title: `Résolution en dehors de SignalConso`,
          desc: `Email envoyé au conso lorsqu'un admin marque le signalement comme résolu en dehors de SignalConso (via le menu "Action administrateur")`,
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
        report_closed_no_action_case_dispute: {
          title: `Pas de réponse (litige)`,
          desc: `Email envoyé lorsque le pro n'a pas répondu au conso après le délai de 60j (dans le cas d'un litige).`,
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
        validate_email: {
          title: `Valider l'email`,
          desc: `Valider l'email du conso lors de son premier signalement`,
        },
      },
    },
    testPdfs: {
      accountActivation: {
        title: `Courrier d'activation`,
      },
      accountActivationReminder: {
        title: `Courrier d'activation (relance)`,
      },
      accountActivationLastReminder: {
        title: `Courrier d'activation (dernière relance)`,
      },
      accountFollowUp: {
        title: `Courrier de relance pour inactivité`,
      },
      report: {
        title: `Téléchargement du signalement`,
        desc: `Récapitulatif du signalement, à l'intention des agents de la DGCCRF. Correspond au bouton "Télécharger" sur la fiche du signalement.`,
      },
      proResponse: {
        title: 'Réponse du pro',
        desc: `Récap de la réponse du professionel. Il est ajouté à la fin du PDF "Accusé de réception", accessible depuis la fiche du signalement.`,
      },
    },
    websiteEdited: 'Site web identifié.',
    reportCompanyEdited: 'Signalement associé à une entreprise ou un pays',
    websiteDeleted: 'Site web supprimé.',
    websiteCreated: 'Site web associé.',
    createWebsite: 'Associer un site web',
    alreadySelectedCompany: (name?: string) =>
      `L'entreprise ${name ?? ''} est déjà sélectionnée`,
    alreadySelectedCountry: (name?: string) =>
      `Le pays ${name ?? ''} est déjà sélectionnée`,
    alreadySelectedValue: (name?: string) =>
      `La valeur ${name ?? ''} est déjà sélectionnée`,
    nLines: (n: number) => `<b>${n}</b> lignes`,
    reportResponse: {
      [ReportResponseTypes.Accepted]: 'Promesse de solution',
      [ReportResponseTypes.Rejected]: 'Signalement infondé',
      [ReportResponseTypes.NotConcerned]:
        'Etablissement non concerné par le signalement',
    },
    reportResponseShort: {
      [ReportResponseTypes.Accepted]: 'Promesse de solution',
      [ReportResponseTypes.Rejected]: 'Infondé',
      [ReportResponseTypes.NotConcerned]: 'Non concerné',
    },
    responseDetails: {
      REMBOURSEMENT_OU_AVOIR: 'Je vais procéder à un remboursement ou un avoir',
      REPARATION_OU_REMPLACEMENT:
        'Je vais procéder à une réparation ou au remplacement du produit défectueux',
      LIVRAISON: 'Je vais procéder à la livraison du bien ou du service',
      CONSEIL_D_UTILISATION: 'Je souhaite apporter un conseil d’utilisation',
      ME_CONFORMER_A_LA_REGLEMENTATION:
        'Je vais me conformer à la réglementation en vigueur',
      ADAPTER_MES_PRATIQUES: 'Je vais adapter mes pratiques',
      TRANSMETTRE_AU_SERVICE_COMPETENT:
        'Je vais transmettre la demande au service compétent',
      DEMANDE_DE_PLUS_D_INFORMATIONS:
        'Je vais demander davantage d’informations au consommateur afin de lui apporter une réponse',
      RESILIATION: 'Je vais procéder à la résiliation du contrat',
      PRATIQUE_LEGALE: 'La pratique signalée est légale',
      PRATIQUE_N_A_PAS_EU_LIEU: 'La pratique signalée n’a pas eu lieu',
      MAUVAISE_INTERPRETATION:
        'Il s’agit d’une mauvaise interprétation des faits',
      DEJA_REPONDU: 'J’ai déjà répondu à ce consommateur sur la plateforme',
      TRAITEMENT_EN_COURS:
        'Le traitement de ce cas est déjà en cours auprès de notre service client',
      PARTENAIRE_COMMERCIAL:
        'Il concerne un de nos partenaires commerciaux / vendeurs tiers',
      ENTREPRISE_DU_MEME_GROUPE: 'Il concerne une entreprise du même groupe',
      HOMONYME: 'Il concerne une société homonyme',
      ENTREPRISE_INCONNUE: 'Il concerne une société que je ne connais pas',
      USURPATION: 'Il s’agit d’une usurpation d’identité professionnelle',
      AUTRE: 'Autre',
    },
    emailValidationStatusTooltipDesc: {
      [EmailValidationStatus.Expired]:
        "Email expiré qui nécessite une revalidation. Cliquez sur l'icone pour valider à la place de l'utilisateur",
      [EmailValidationStatus.Invalid]:
        "Email non validé. Cliquez sur l'icone pour valider à la place de l'utilisateur",
      [EmailValidationStatus.Valid]: 'Email validé',
    },
    responseEvaluation: {
      [ResponseEvaluation.Positive]: "J'en suis satisfait",
      [ResponseEvaluation.Neutral]: 'Je reste neutre',
      [ResponseEvaluation.Negative]: `J'en suis mécontent`,
    },
    responseEvaluationShort: {
      [ResponseEvaluation.Positive]: 'Positif',
      [ResponseEvaluation.Neutral]: 'Mitigé',
      [ResponseEvaluation.Negative]: 'Négatif',
    },
    reportStatusShort: {
      [ReportStatus.NA]: 'Non transmis',
      [ReportStatus.InformateurInterne]: 'Informateur interne',
      [ReportStatus.TraitementEnCours]: 'Traitement en cours',
      [ReportStatus.NonConsulte]: 'Non consulté',
      [ReportStatus.Transmis]: 'Transmis',
      [ReportStatus.PromesseAction]: `Promesse d'action`,
      [ReportStatus.Infonde]: 'Infondé',
      [ReportStatus.ConsulteIgnore]: 'Consulté ignoré',
      [ReportStatus.MalAttribue]: 'Mal attribué',
    },
    reportStatusShortPro: {
      [ReportStatusPro.ARepondre]: 'À répondre',
      [ReportStatusPro.Cloture]: 'Clôturé',
    },
    reportStatusDescPro: {
      [ReportStatusPro.ARepondre]: `Signalements en attente d'une réponse`,
      [ReportStatusPro.Cloture]:
        "Signalements ayant fait l'objet d'une réponse ou dont le délai de réponse a expiré",
    },
    reportStatusDesc: {
      [ReportStatus.NA]: `Il y a eu un signalement déposé par un consommateur. Mais, le consommateur n’a pas pu identifier la société. Cela peut être le cas pour les sites internet et des démarchages téléphoniques ou à domicile.`,
      [ReportStatus.InformateurInterne]: `Le signalement n’est pas envoyé au professionnel. Cela correspond aux cas où le consommateur s’est signalé comme employé du professionnel.`,
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
    dayShort_: {
      1: 'Dim',
      2: 'Lun',
      3: 'Mar',
      4: 'Mer',
      5: 'Jeu',
      6: 'Ven',
      7: 'Sam',
    },
    apiErrorsCode: {
      'SC-0001': `Une erreur s'est produite`,
      'SC-0002': `L'utilisateur DGCCRF n'existe pas.`,
      'SC-0003': `Le professionnel n'existe pas.`,
      'SC-0004': `L'entreprise n'existe pas.`,
      'SC-0005': `Le site web n'existe pas.`,
      'SC-0006': `L'entreprise est déjà associée à un site.`,
      'SC-0007': `URL invalide.`,
      'SC-0008': `Email invalide pour ce type d'utilisateur.`,
      'SC-0009': `L'utilisateur existe déjà.`,
      'SC-0010': `L'entreprise a déjà été activée.`,
      'SC-0011': `L'entreprise n'existe pas.`,
      'SC-0012': `Le code d'activation est périmé.`,
      'SC-0013': `Le code d'activation est invalide.`,
    },
    Train: {
      INOUI_INTERCITES: 'TGV Inoui et Intercités',
      OUIGO: 'Ouigo Grande Vitesse et Ouigo Train Classique',
      TER: 'TER',
      TRANSILIEN: 'Transilien',
      EUROSTAR: 'Eurostar',
      TGV_LYRIA: 'TGV Lyria',
      TGV_ITALIE: 'TGV Italie',
      TRENITALIA: 'Trenitalia France',
      RENFE: 'Renfe',
      ICE: 'Ice',
      TRAIN_DE_NUIT: 'Train de nuit',
    },
    Ter: {
      AUVERGNE_RHONE_ALPES: 'TER AUVERGNE-RHÔNE-ALPES',
      BOURGOGNE_FRANCHE_COMTE: 'TER BOURGOGNE-FRANCHE-COMTE',
      BRETAGNE: 'TER BRETAGNE',
      CENTRE_VAL_DE_LOIRE: 'TER CENTRE-VAL DE LOIRE',
      GRAND_EST: 'TER GRAND EST',
      HAUTS_DE_FRANCE: 'TER HAUTS-DE-FRANCE',
      NOUVELLE_AQUITAINE: 'TER NOUVELLE AQUITAINE',
      NORMANDIE: 'TER NORMANDIE',
      OCCITANIE: 'TER OCCITANIE',
      PAYS_DE_LA_LOIRE: 'TER PAYS DE LA LOIRE',
      SUD_PACA: 'TER SUD PROVENCE-ALPES-CÔTE D’AZUR',
    },
    NightTrain: {
      INTERCITE_DE_NUIT: 'Intercité de nuit',
      NIGHTJET: 'Nightjet',
    },
    specialLegislation: {
      SHRINKFLATION: `Seuls les magasins dont la surface de vente est <strong>supérieure à 400 m²</strong> sont concernés par la règlementation relative à la réduflation (ou shrinkflation). Il est probable que cet établissement n’y soit pas soumis.`,
    },
  },
}
