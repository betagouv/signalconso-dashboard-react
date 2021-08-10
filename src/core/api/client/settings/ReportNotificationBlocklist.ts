import {Entity, Id, PaginatedFilters} from '../../model/Common'
import {Company} from '../company/Company'


export interface ReportNotificationBlockListSearch extends PaginatedFilters {
  user_id?: Id
}

export interface ReportNotificationBlockList extends Entity {
  company: Company
  active: boolean
}
