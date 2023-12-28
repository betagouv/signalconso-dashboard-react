import {useQuery} from '@tanstack/react-query'
import {useApiContext} from '../context/ApiContext'
import {UseQueryOpts} from './types'
import {Id} from '../model'
import {BarcodeProduct} from '../client/barcode/BarcodeProduct'

const GetBarcodeQueryKeys = (barcodeProductId: Id) => ['barcode_get', barcodeProductId]

export const useGetBarcodeQuery = (barcodeProductId: Id, options?: UseQueryOpts<BarcodeProduct, string[]>) => {
  const {api} = useApiContext()
  return useQuery({
    queryKey: GetBarcodeQueryKeys(barcodeProductId),
    queryFn: () => api.secured.barcode.get(barcodeProductId),
    ...options,
  })
}
