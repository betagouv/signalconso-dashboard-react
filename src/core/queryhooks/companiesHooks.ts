import {useQuery} from '@tanstack/react-query'
import {useApiContext} from '../context/ApiContext'
import {UseQueryOpts} from './types'
import {CompanyWithAccessLevel} from '../model'

export const useGetAccessibleByProQuery = (options?: UseQueryOpts<CompanyWithAccessLevel[], string[]>) => {
  const {api} = useApiContext()
  return useQuery(['company_getAccessibleByPro'], () => api.secured.company.getAccessibleByPro(), options)
}
