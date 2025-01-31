import { useApiContext } from '../context/ApiContext'
import { useQueryPaginate } from './UseQueryPaginate'
import { ConsumerEmailValidationSearch } from '../client/consumer-email-validation/ConsumerEmailValidation'

const ConsumerEmailValidationSearchQueryKeys = [
  'consumerEmailValidation_search',
]

export const useConsumerEmailValidationSearchQuery = () => {
  const { api } = useApiContext()
  const defaultFilters: ConsumerEmailValidationSearch = {
    limit: 25,
    offset: 0,
  }
  return useQueryPaginate(
    ConsumerEmailValidationSearchQueryKeys,
    api.secured.consumerEmailValidation.search,
    defaultFilters,
  )
}
