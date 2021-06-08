import {Country, Department} from '../..'

export type SubscriptionFrequency = 'P7D' | 'P1D';

export interface Subscription {
  id: string;
  departments: Department[];
  categories: string[];
  sirets: string[];
  frequency: SubscriptionFrequency;
  countries: Country[];
  tags: string[];
}

export interface SubscriptionCreate {
  departments: Department[];
  categories: string[];
  sirets: string[];
  frequency: SubscriptionFrequency;
  countries: Country[];
  tags: string[];
}
