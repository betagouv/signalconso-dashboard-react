import {UseQueryOpts} from './types'
import {useApiContext} from '../context/ApiContext'
import {useQuery} from '@tanstack/react-query'
import {Country, Region} from '../client/constant/Country'
import {Category} from '../client/constant/Category'

const RegionsQueryKeys = ['constant_getRegions']
const CountriesQueryKeys = ['constant_getCountries']
const CategoriesQueryKeys = ['constant_getCategories']
export const useRegionsQuery = (options?: UseQueryOpts<Region[], string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: RegionsQueryKeys, queryFn: api.public.constant.getRegions, ...options})
}

export const useCountriesQuery = (options?: UseQueryOpts<Country[], string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: CountriesQueryKeys, queryFn: api.public.constant.getCountries, ...options})
}

export const useCategoriesQuery = (options?: UseQueryOpts<Category[], string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: CategoriesQueryKeys, queryFn: api.public.constant.getCategories, ...options})
}
