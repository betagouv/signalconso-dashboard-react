import {
  Address,
  ConsumerReview,
  EventWithUser,
  Id,
  MinimalUser,
  ReportProResponseEvent,
  UploadedFile,
} from '../../model'
import { Category } from '../constant/Category'

export const ReportingDateLabel = 'Date du constat'

enum Gender {
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
  RGPDDeleteRequest = 'RGPDDeleteRequest',
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
  RappelConso = 'RappelConso',
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
  Shrinkflation = 'Shrinkflation',
}

export const outdatedTags = [ReportTag.Bloctel]

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
  activityCode?: string
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
  rappelConsoId?: number
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
  isBookmarked: boolean
  files: UploadedFile[]
  professionalResponse?: EventWithUser
  consumerReview?: ConsumerReview
  engagementReview?: ConsumerReview
  assignedUser?: MinimalUser
}

export type ReportExtra = {
  report: Report
  metadata?: ReportMetadata
  isBookmarked: boolean
  assignedUser?: MinimalUser
  files: UploadedFile[]
  companyAlbertActivityLabel?: string
}

type ReportMetadata = {
  reportId: Id
  isMobileApp: boolean
  os?: 'Android' | 'Ios'
  assignedUserId?: Id
}

export enum ReportStatus {
  NA = 'NA',
  InformateurInterne = 'InformateurInterne',
  TraitementEnCours = 'TraitementEnCours',
  Transmis = 'Transmis',
  PromesseAction = 'PromesseAction',
  Infonde = 'Infonde',
  NonConsulte = 'NonConsulte',
  ConsulteIgnore = 'ConsulteIgnore',
  MalAttribue = 'MalAttribue',
  SuppressionRGPD = 'SuppressionRGPD',
}

export enum ReportStatusPro {
  ARepondre = 'ARepondre',
  Cloture = 'Cloture',
}

export type ReportConsumerUpdate = Pick<
  Report,
  'firstName' | 'lastName' | 'email' | 'consumerReferenceNumber'
>

export enum SpecialLegislation {
  SHRINKFLATION = 'SHRINKFLATION',
}

export type ReportClosedReason =
  | {
      kind: 'suppression_rgpd'
    }
  | {
      kind: 'no_response'
      expirationDate: Date
    }
  | {
      kind: 'response'
      responseEvent: ReportProResponseEvent | undefined
    }

export class ReportUtils {
  static readonly waitingResponseStatus = [
    ReportStatus.Transmis,
    ReportStatus.TraitementEnCours,
  ]

  static readonly closedStatus = [
    ReportStatus.PromesseAction,
    ReportStatus.Infonde,
    ReportStatus.NonConsulte,
    ReportStatus.ConsulteIgnore,
    ReportStatus.MalAttribue,
    ReportStatus.SuppressionRGPD,
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

  static readonly respondedStatus = [
    ReportStatus.PromesseAction,
    ReportStatus.Infonde,
    ReportStatus.MalAttribue,
  ]
  static readonly notRespondedStatus = [
    ReportStatus.NA,
    ReportStatus.InformateurInterne,
    ReportStatus.TraitementEnCours,
    ReportStatus.Transmis,
    ReportStatus.NonConsulte,
    ReportStatus.ConsulteIgnore,
  ]
  static readonly invisibleToProStatus = [
    ReportStatus.NA,
    ReportStatus.InformateurInterne,
  ]

  static readonly isClosed = (status: ReportStatus) => {
    return ReportUtils.closedStatus.includes(status)
  }

  static readonly canReopenReport = (status: ReportStatus) =>
    status === ReportStatus.NonConsulte ||
    status === ReportStatus.ConsulteIgnore

  static readonly getClosedReason = (
    report: Report,
    responseEvent: ReportProResponseEvent | undefined,
  ): ReportClosedReason | undefined => {
    if (ReportUtils.isClosed(report.status)) {
      switch (report.status) {
        case ReportStatus.SuppressionRGPD:
          return { kind: 'suppression_rgpd' }
        case ReportStatus.ConsulteIgnore:
        case ReportStatus.NonConsulte:
          return { kind: 'no_response', expirationDate: report.expirationDate }
        default:
          return { kind: 'response', responseEvent }
      }
    }
    return undefined
  }

  static readonly isWaitingForResponse = (status: ReportStatus) => {
    return ReportUtils.waitingResponseStatus.includes(status)
  }

  static readonly getStatusProByStatus = (
    status: ReportStatus,
  ): ReportStatusPro =>
    ReportUtils.isClosed(status)
      ? ReportStatusPro.Cloture
      : ReportStatusPro.ARepondre

  static readonly getStatusByStatusPro = (
    statusPro: ReportStatusPro,
  ): ReportStatus[] =>
    Object.values(ReportStatus)
      .filter((_) => !ReportUtils.invisibleToProStatus.includes(_))
      .filter((_) => ReportUtils.getStatusProByStatus(_) === statusPro)

  static readonly isGovernmentCompany = (_?: {
    activityCode?: string
  }): boolean => _?.activityCode?.startsWith('84.') ?? false

  static readonly appliedSpecialLegislation = (
    report: Pick<Report, 'activityCode' | 'tags'>,
  ): SpecialLegislation | undefined => {
    // 47.11C supérettes moins de 400 m2
    // 47.11D supermarchés entre 400 et 2500
    // 47.11F hypermarchés égale ou > à 2500 m2
    if (
      ReportUtils.readTags(report).includes(ReportTag.Shrinkflation) &&
      report.activityCode === '47.11C'
    ) {
      return SpecialLegislation.SHRINKFLATION
    }
  }

  static readTags(r: Pick<Report, 'tags'>) {
    return r.tags.filter((_) => !outdatedTags.includes(_))
  }
}
