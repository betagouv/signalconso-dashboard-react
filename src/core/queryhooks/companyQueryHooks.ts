import {useQuery} from '@tanstack/react-query'
import {useApiContext} from '../context/ApiContext'
import {UseQueryOpts} from './types'
import {CompanyWithAccessLevel} from '../model'

const GetAccessibleByProQueryKeys = ['company_getAccessibleByPro']

export const useGetAccessibleByProQuery = (options?: UseQueryOpts<CompanyWithAccessLevel[], string[]>) => {
  const {api} = useApiContext()
  return useQuery({queryKey: GetAccessibleByProQueryKeys, queryFn: api.secured.company.getAccessibleByPro, ...options})
}
