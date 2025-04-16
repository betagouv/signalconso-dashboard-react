import { useQuery } from '@tanstack/react-query'
import { useApiContext } from '../context/ApiContext'

export const useCompaniesOfProQuery = () => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ['accessesMassManagement_getCompaniesOfPro'],
    queryFn: () => api.secured.accessesMassManagement.getCompaniesOfPro(),
  })
}

export const useUsersOfProQuery = () => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: ['accessesMassManagement_getUsersOfPro'],
    queryFn: () => api.secured.accessesMassManagement.getUsersOfPro(),
  })
}
