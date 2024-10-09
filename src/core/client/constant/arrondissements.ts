import { mapFor } from 'core/helper'
import { GeoAreaRaw } from './geoAreas'

const arrondissementsMarseille: GeoAreaRaw[] = mapFor(16, (i) => ({
  region_code: '93',
  code: '' + (13000 + i + 1),
  name: `Marseille ${i + 1}e Arrondissement`,
}))
const arrondissementsLyon: GeoAreaRaw[] = mapFor(9, (i) => ({
  region_code: '84',
  code: '' + (69000 + i + 1),
  name: `Lyon ${i + 1}e Arrondissement`,
}))
const arrondissementsParis: GeoAreaRaw[] = mapFor(20, (i) => ({
  region_code: '11',
  code: '' + (75000 + i + 1),
  name: `Paris ${i + 1}e Arrondissement`,
}))

export const arrondissements = [
  ...arrondissementsLyon,
  ...arrondissementsMarseille,
  ...arrondissementsParis,
]
