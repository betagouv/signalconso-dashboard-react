import { arrondissements } from './arrondissements'
import { communes94 } from './communes'
import { departments } from './departments'

export type GeoAreaRaw = {
  region_code: string
  code: string
  name: string
}

export const rawGeoAreas: GeoAreaRaw[] = [
  ...departments,
  ...arrondissements,
  ...communes94,
]
