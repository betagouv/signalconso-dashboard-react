import {Id} from '../../model'

export interface AsyncFile {
  id: Id
  creationDate: Date
  filename: string
  url: string
  type: AsyncFileType
  status: AsyncFileStatus
}

export enum AsyncFileStatus {
  Loading = 'Loading',
  Failed = 'Failed',
  Successed = 'Successed',
}

export enum AsyncFileType {
  ReportedPhones = 'ReportedPhones',
  Reports = 'Reports',
  ReportedWebsites = 'ReportedWebsites',
}
