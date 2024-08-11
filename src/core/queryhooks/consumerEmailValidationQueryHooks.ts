import {useApiContext} from '../context/ApiContext'
import {useQueryPaginate} from './UseQueryPaginate'

export const ConsumerEmailValidationSearchQueryKeys = ['consumerEmailValidation_search']

export const useConsumerEmailValidationSearchQuery = () => {
  const {api} = useApiContext()
  const defaultFilters = {
    limit: 25,
    offset: 0,
  }
  return useQueryPaginate(ConsumerEmailValidationSearchQueryKeys, api.secured.consumerEmailValidation.search, defaultFilters)
}
