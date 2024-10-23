import { useQuery } from '@tanstack/react-query'
import { BarcodeProduct } from '../client/barcode/BarcodeProduct'
import { useApiContext } from '../context/ApiContext'
import { Id } from '../model'
import { UseQueryOpts } from './UseQueryOpts'

const GetBarcodeQueryKeys = (barcodeProductId: Id) => [
  'barcode_get',
  barcodeProductId,
]

export const useGetBarcodeQuery = (
  barcodeProductId: Id,
  options?: UseQueryOpts<BarcodeProduct, string[]>,
) => {
  const { api } = useApiContext()
  return useQuery({
    queryKey: GetBarcodeQueryKeys(barcodeProductId),
    queryFn: () => api.secured.barcode.get(barcodeProductId),
    ...options,
  })
}
