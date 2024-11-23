import { Category } from '../constant/Category'
import { Country, GeoArea } from '../constant/Country'
import { ReportTag } from '../report/Report'

type SubscriptionFrequency = 'P7D' | 'P1D'

export interface Subscription {
  id: string
  departments: GeoArea[]
  categories: Category[]
  sirets: string[]
  frequency: SubscriptionFrequency
  countries: Country[]
  withTags: ReportTag[]
  withoutTags: ReportTag[]
}

export interface SubscriptionCreate {
  departments: string[]
  categories: string[]
  sirets: string[]
  frequency: SubscriptionFrequency
  countries: string[]
  withTags: ReportTag[]
  withoutTags: ReportTag[]
}
