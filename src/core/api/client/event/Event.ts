import {Id} from '../../model/Common'

export interface ReportEvent {
  data: Event
  user?: EventUser
}

export interface Event {
  id: Id
  reportId: Id
  creationDate: Date
  userId: Id
  eventType: EventType
  action: EventActionValues
  details: {description: string} | ReportResponse
}

export type EventType = 'PRO' | 'CONSO' | 'DGCCRF' | 'ADMIN' | 'SYSTEM'

export interface EventUser {
  firstName: string
  lastName: string
  role: string
}

export enum EventActionValues {
  FirstVisit = 'Première consultation du signalement par le professionnel',
  ReportResponse = 'Réponse du professionnel au signalement',
  PostalSend = 'Envoi d\'un courrier',
  EditConsumer = 'Modification du consommateur',
  EditCompany = 'Modification du commerçant',
  Comment = 'Ajout d\'un commentaire',
  Control = 'Contrôle effectué',
  ConsumerAttachments = 'Ajout de pièces jointes fournies par le consommateur',
  ProfessionalAttachments = 'Ajout de pièces jointes fournies par l\'entreprise'
}

export interface ReportResponse {
  responseType: ReportResponseTypes
  consumerDetails: string
  dgccrfDetails: string
  fileIds: string[]
}

export enum ReportResponseTypes {
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  NotConcerned = 'NOT_CONCERNED'
}

export interface ReviewOnReportResponse {
  positive: boolean
  details: string
}

export interface ReportAction {
  actionType: EventActionValues;
  details?: string;
  fileIds: string[];
}

