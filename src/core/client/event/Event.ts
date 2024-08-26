import {Id} from '../../model'

export interface ReportEvent {
  data: Event
  user?: EventUser
}

// a precise subtype
export type ReportProResponseEvent = ReportEvent & {
  action: EventActionValues.ReportProResponse
  user?: EventUser
  data: {
    details: ExistingReportResponse
  }
}

export interface EventWithUser {
  event: Event
  user: EventUser
}

export interface Event {
  id: Id
  reportId?: Id
  creationDate: Date
  userId?: Id
  eventType: EventType
  action: EventActionValues
  details: {description: string} | ExistingReportResponse | {description: string; comment: string}
}

export type EventType = 'PRO' | 'CONSO' | 'DGCCRF' | 'ADMIN' | 'SYSTEM'

export interface EventUser {
  firstName: string
  lastName: string
  role: string
}

export enum EventActionValues {
  Creation = 'Signalement du consommateur',
  PostAccountActivationDoc = "Envoi du courrier d'activation",
  AccountActivation = "Activation d'un compte",
  ActivationDocReturned = "Courrier d'activation retourné",
  ActivationDocRequired = "Courrier d'activation à renvoyer",
  CompanyAddressChange = "Modification de l'adresse de l'entreprise",
  ReportReadingByPro = 'Première consultation du signalement par le professionnel',
  ReportProResponse = 'Réponse du professionnel au signalement',
  ReportProEngagementHonoured = 'Engagement du professionnel marqué comme honoré',
  ReportReviewOnResponse = 'Avis du consommateur sur la réponse du professionnel',
  ReportClosedByNoReading = 'Signalement non consulté',
  ReportClosedByNoAction = 'Signalement consulté ignoré',
  EmailConsumerAcknowledgment = 'Email « Accusé de réception » envoyé au consommateur',
  EmailConsumerReportReading = 'Email « Signalement consulté » envoyé au consommateur',
  EmailConsumerReportResponse = "Email « L'entreprise a répondu à votre signalement » envoyé au consommateur",
  EmailConsumerReportClosedByNoReading = "Email « L'entreprise n'a pas souhaité consulter votre signalement » envoyé au consommateur",
  EmailConsumerReportClosedByNoAction = "Email « L'entreprise n'a pas répondu au signalement » envoyé au consommateur",
  EmailProNewReport = 'Email « Nouveau signalement » envoyé au professionnel',
  EmailProResponseAcknowledgment = 'Email « Accusé de réception de la réponse » envoyé au professionnel',
  EmailProRemindNoReading = 'Email « Nouveau signalement non consulté » envoyé au professionnel',
  EmailProRemindNoAction = 'Email « Nouveau signalement en attente de réponse » envoyé au professionnel',
  ReportCompanyChange = 'Modification du commerçant',
  ReportConsumerChange = 'Modification du consommateur',
  Comment = "Ajout d'un commentaire",
  ConsumerAttachments = 'Ajout de pièces jointes fournies par le consommateur',
  ProfessionalAttachments = "Ajout de pièces jointes fournies par l'entreprise",
  Control = 'Contrôle effectué',
  ConsumerThreatenByProReportDeletion = 'ConsumerThreatenByProReportDeletion',
  RefundBlackMailReportDeletion = 'RefundBlackMailReportDeletion',
  OtherReasonDeleteRequestReportDeletion = 'OtherReasonDeleteRequestReportDeletion',
  SolvedContractualDisputeReportDeletion = 'SolvedContractualDisputeReportDeletion',
  ReportReOpenedByAdmin = 'ReportReOpenedByAdmin',
  ReportAffectedToUser = 'Signalement affecté à un utilisateur',
}

export const acceptedDetails = [
  'REMBOURSEMENT_OU_AVOIR',
  'REPARATION_OU_REMPLACEMENT',
  'LIVRAISON',
  'CONSEIL_D_UTILISATION',
  'ME_CONFORMER_A_LA_REGLEMENTATION',
  'ADAPTER_MES_PRATIQUES',
  'TRANSMETTRE_AU_SERVICE_COMPETENT',
  'DEMANDE_DE_PLUS_D_INFORMATIONS',
  'RESILIATION',
] as const
export type AcceptedDetails = typeof acceptedDetails[number]

export const rejectedDetails = [
  'PRATIQUE_LEGALE',
  'PRATIQUE_N_A_PAS_EU_LIEU',
  'MAUVAISE_INTERPRETATION',
  'DEJA_REPONDU',
  'TRAITEMENT_EN_COURS',
] as const
export type RejectedDetails = typeof rejectedDetails[number]

export const notConcernedDetails = [
  'PARTENAIRE_COMMERCIAL',
  'ENTREPRISE_DU_MEME_GROUPE',
  'HOMONYME',
  'ENTREPRISE_INCONNUE',
  'USURPATION',
] as const
export type NotConcernedDetails = typeof notConcernedDetails[number]

export interface IncomingReportResponse {
  responseType: ReportResponseTypes
  responseDetails: AcceptedDetails | RejectedDetails | NotConcernedDetails
  consumerDetails: string
  dgccrfDetails: string
  fileIds?: string[]
}

// An already created report response, coming from the DB
// It may contains the legacy value 'AUTRE' that is not allowed anymore
export type ExistingReportResponse = Omit<IncomingReportResponse, 'responseDetails'> & {
  responseDetails: IncomingReportResponse['responseDetails'] | 'AUTRE'
  otherResponseDetails?: string
}

export enum ReportResponseTypes {
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  NotConcerned = 'NOT_CONCERNED',
}

export enum ResponseEvaluation {
  Negative = 'Negative',
  Neutral = 'Neutral',
  Positive = 'Positive',
}

export type ConsumerReview = {
  id: string
  reportId: string
  evaluation: ResponseEvaluation
  creationDate: Date
  details?: string
}

export interface ReportWordCount {
  value: string
  count: number
}

export interface ReportAction {
  actionType: EventActionValues
  details?: string
  fileIds: string[]
}
