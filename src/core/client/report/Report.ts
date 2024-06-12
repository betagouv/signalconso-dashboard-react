import {Address, ConsumerReview, EventWithUser, Id, MinimalUser, UploadedFile} from '../../model'
import {Category} from '../constant/Category'

export const ReportingDateLabel = 'Date du constat'
export const ReportingTimeslotLabel = 'Heure du constat'
export const DescriptionLabel = 'Description'

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export enum ReportType {
  Shop = 'Shop',
  Internet = 'Internet',
  Both = 'Both',
}

export interface ReportDeletionReason {
  reportAdminActionType: ReportAdminActionType
  comment?: string
}

export enum ReportAdminActionType {
  SolvedContractualDispute = 'SolvedContractualDispute',
  ConsumerThreatenByPro = 'ConsumerThreatenByPro',
  RefundBlackMail = 'RefundBlackMail',
  OtherReasonDeleteRequest = 'OtherReasonDeleteRequest',
}

export enum ReportTag {
  LitigeContractuel = 'LitigeContractuel',
  Hygiene = 'Hygiene',
  ProduitDangereux = 'ProduitDangereux',
  DemarchageADomicile = 'DemarchageADomicile',
  Ehpad = 'Ehpad',
  DemarchageTelephonique = 'DemarchageTelephonique',
  DemarchageInternet = 'DemarchageInternet',
  AbsenceDeMediateur = 'AbsenceDeMediateur',
  Bloctel = 'Bloctel',
  Influenceur = 'Influenceur',
  ReponseConso = 'ReponseConso',
  Internet = 'Internet',
  ProduitIndustriel = 'ProduitIndustriel',
  ProduitAlimentaire = 'ProduitAlimentaire',
  CompagnieAerienne = 'CompagnieAerienne',
  Resiliation = 'Resiliation',
  OpenFoodFacts = 'OpenFoodFacts',
  TransitionEcologique = 'TransitionEcologique',
  ProduitPerime = 'ProduitPerime',
  CommandeEffectuee = 'CommandeEffectuee',
  ImpressionTicket = 'ImpressionTicket',
  QuantiteNonConforme = 'QuantiteNonConforme',
  AppelCommercial = 'AppelCommercial',
  Prix = 'Prix',
  AlimentationMaterielAnimaux = 'AlimentationMaterielAnimaux',
  BauxPrecaire = 'BauxPrecaire',
  Telecom = 'Telecom',
}

export const OutdatedTags = [ReportTag.Bloctel]

export interface Report {
  id: string
  gender?: Gender
  category: Category
  subcategories: string[]
  tags: ReportTag[]
  companyId?: string
  companyName?: string
  companyCommercialName?: string
  companyEstablishmentCommercialName?: string
  companyBrand?: string
  companyAddress: Address
  companySiret?: string
  websiteURL?: string
  vendor?: string
  phone?: string
  details: DetailInputValue[]
  firstName: string
  lastName: string
  email: string
  consumerPhone?: string
  consumerReferenceNumber?: string
  employeeConsumer: boolean
  contactAgreement: boolean
  creationDate: Date
  status: ReportStatus
  reponseconsoCode: string[]
  ccrfCode: string[]
  expirationDate: Date
  influencer?: Influencer
  visibleToPro?: boolean
  barcodeProductId?: string
  train?: Train
  station?: string
}

export interface Influencer {
  socialNetwork?: string
  otherSocialNetwork?: string
  name: string
}

export interface Train {
  train: string
  ter?: string
  nightTrain?: string
}

export interface DetailInputValue {
  label: string
  value: string
}

export interface ReportSearchResult {
  report: Report
  metadata?: ReportMetadata
  files: UploadedFile[]
  professionalResponse?: EventWithUser
  consumerReview?: ConsumerReview
  engagementReview?: ConsumerReview
  assignedUser?: MinimalUser
}

export interface ReportWithMetadata {
  report: Report
  metadata?: ReportMetadata
}

type ReportMetadata = {
  reportId: Id
  isMobileApp: boolean
  os?: 'Android' | 'Ios'
  assignedUserId?: Id
}

export enum ReportStatus {
  NA = 'NA',
  LanceurAlerte = 'LanceurAlerte',
  TraitementEnCours = 'TraitementEnCours',
  Transmis = 'Transmis',
  PromesseAction = 'PromesseAction',
  Infonde = 'Infonde',
  NonConsulte = 'NonConsulte',
  ConsulteIgnore = 'ConsulteIgnore',
  MalAttribue = 'MalAttribue',
}

export enum ReportStatusPro {
  ARepondre = 'ARepondre',
  Cloture = 'Cloture',
}

export type ReportConsumerUpdate = Pick<Report, 'firstName' | 'lastName' | 'email' | 'consumerReferenceNumber'>

export class Report {
  static readonly waitingResponseStatus = [ReportStatus.Transmis, ReportStatus.TraitementEnCours]

  static readonly closedStatus = [
    ReportStatus.PromesseAction,
    ReportStatus.Infonde,
    ReportStatus.NonConsulte,
    ReportStatus.ConsulteIgnore,
    ReportStatus.MalAttribue,
  ]

  static readonly transmittedStatus = [
    ReportStatus.TraitementEnCours,
    ReportStatus.Transmis,
    ReportStatus.PromesseAction,
    ReportStatus.Infonde,
    ReportStatus.NonConsulte,
    ReportStatus.ConsulteIgnore,
    ReportStatus.MalAttribue,
  ]

  static readonly readStatus = [
    ReportStatus.Transmis,
    ReportStatus.PromesseAction,
    ReportStatus.Infonde,
    ReportStatus.MalAttribue,
    ReportStatus.ConsulteIgnore,
  ]

  static readonly respondedStatus = [ReportStatus.PromesseAction, ReportStatus.Infonde, ReportStatus.MalAttribue]
  static readonly notRespondedStatus = [
    ReportStatus.NA,
    ReportStatus.LanceurAlerte,
    ReportStatus.TraitementEnCours,
    ReportStatus.Transmis,
    ReportStatus.NonConsulte,
    ReportStatus.ConsulteIgnore,
  ]
  static readonly invisibleToProStatus = [ReportStatus.NA, ReportStatus.LanceurAlerte]
  static readonly closedBySystemStatus = [ReportStatus.NonConsulte, ReportStatus.ConsulteIgnore]

  static readonly isClosed = (status: ReportStatus) => {
    return Report.closedStatus.includes(status)
  }

  static readonly isWaitingForResponse = (status: ReportStatus) => {
    return Report.waitingResponseStatus.includes(status)
  }

  static readonly getStatusProByStatus = (status: ReportStatus): ReportStatusPro =>
    Report.isClosed(status) ? ReportStatusPro.Cloture : ReportStatusPro.ARepondre

  static readonly getStatusByStatusPro = (statusPro: ReportStatusPro): ReportStatus[] =>
    Object.values(ReportStatus)
      .filter(_ => !Report.invisibleToProStatus.includes(_))
      .filter(_ => Report.getStatusProByStatus(_) === statusPro)

  static readonly isGovernmentCompany = (_?: {activityCode?: string}): boolean => _?.activityCode?.startsWith('84.') ?? false
}
