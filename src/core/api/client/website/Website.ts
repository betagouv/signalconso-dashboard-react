import {Entity, Id, PaginatedFilters} from '../../model/Common'
import {Company} from '../company/Company'

export enum WebsiteKind {
  DEFAULT = 'DEFAULT',
  MARKETPLACE = 'MARKETPLACE',
  PENDING = 'PENDING'
}

export interface Website extends Entity {
  creationDate: Date;
  host: string;
  companyId: Id;
  kind: WebsiteKind;
}

export interface WebsiteUpdateCompany {
  companySiret: string;
  companyName: string;
  companyAddress?: string;
  companyPostalCode?: string;
  companyActivityCode?: string;
}

export interface WebsiteCreate extends WebsiteUpdateCompany {
  host: string;
}

export interface WebsiteWithCompany extends Website {
  company: Company;
  count?: 0;
}

export interface HostWithReportCount {
  host: string;
  count: number;
}


export interface ApiHostWithReportCount {
  host: string;
  count: number;
}

export interface WebsiteWithCompanySearch extends PaginatedFilters {
  host?: string
  kind?: string
}