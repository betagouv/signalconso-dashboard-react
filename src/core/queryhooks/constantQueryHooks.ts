import { useQuery } from '@tanstack/react-query'
import { CategoriesByStatus } from '../client/constant/Category'
import { Country, Region } from '../client/constant/Country'
import { useApiContext } from '../context/ApiContext'
import { UseQueryOpts } from './UseQueryOpts'

const RegionsQueryKeys = ['constant_getRegions']
const CountriesQueryKeys = ['constant_getCountries']
const CategoriesByStatusQueryKeys = ['constant_getCategoriesByStatus']
export const useRegionsQuery = (options?: UseQueryOpts<Region[], string[]>) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: RegionsQueryKeys,
    queryFn: api.public.constant.getRegions,
    ...options,
  })
}

export const useCountriesQuery = (
  options?: UseQueryOpts<Country[], string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: CountriesQueryKeys,
    queryFn: api.public.constant.getCountries,
    ...options,
  })
}

export const useCategoriesByStatusQuery = (
  options?: UseQueryOpts<CategoriesByStatus, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: CategoriesByStatusQueryKeys,
    queryFn: api.public.constant.getCategoriesByStatus,
    ...options,
  })
}
