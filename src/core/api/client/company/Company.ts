import {Id} from '../../model/Common'
import {WebsiteKind} from '../website/Website'

export interface WebsiteURL {
  url: string;
}

export interface DraftCompany {
  siret?: string;
  name?: string;
  brand?: string;
  address?: string;
  postalCode?: string;
  country?: string;
  website?: WebsiteURL;
  activityCode?: string;
}

export interface Company {
  id: Id;
  siret: string;
  creationDate: string;
  name: string;
  address: string;
  postalCode?: string;
  activityCode?: string;
}

export interface CompanyToActivate {
  company: Company;
  lastNotice?: string;
  tokenCreation: string;
}

export interface CompanyCreation {
  siret: string;
  name: string;
  address: string;
  postalCode?: string;
  activityCode?: string;
}

export interface CompanyUpdate {
  address: string;
  postalCode: string;
  activationDocumentRequired: boolean;
}


export interface CompanySearchResult extends DraftCompany {
  highlight: string;
  activityCode: string;
  activityLabel: string;
  isHeadOffice: boolean;
  kind?: WebsiteKind;
}

