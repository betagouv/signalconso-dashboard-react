import { ApiClientApi } from '../ApiClient'
import { CategoriesByStatus } from './Category'
import { Country, GeoArea, Region } from './Country'
import { rawGeoAreas } from './geoAreas'
import { rawRegions } from './regions'

export class PublicConstantClient {
  constructor(private client: ApiClientApi) {}

  private readonly regions: Region[] = rawRegions
    .map((region) => ({
      label: region.name,
      departments: rawGeoAreas
        .filter((_) => _.region_code === region.code)
        .map((_) => ({
          code: _.code,
          label: _.name,
        }))
        .sort((r1, r2) => r1.code.localeCompare(r2.code)),
    }))
    .sort((r1, r2) => r1.label.localeCompare(r2.label))

  private readonly geoAreas: GeoArea[] = rawGeoAreas.map((_) => ({
    code: _.code,
    label: _.name,
  }))

  readonly getRegions = () => {
    // Simulate Async call since it could be moved to the API one day for factorization purpose
    return Promise.resolve(this.regions)
  }

  readonly getDepartements = () => {
    // Simulate Async call since it could be moved to the API one day for factorization purpose
    return Promise.resolve(this.geoAreas)
  }

  readonly getDepartmentByCode = (code: string) => {
    // Simulate Async call since it could be moved in the API for factorization purpose
    return Promise.resolve(this.geoAreas.find((_) => _.code === code))
  }

  readonly getCountries = () =>
    this.client.get<Country[]>(`/constants/countries`)
  readonly getCategoriesByStatus = () =>
    this.client.get<CategoriesByStatus>(`/constants/categoriesByStatus`)
}
