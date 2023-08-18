import {config} from '../conf/config'
import {SignalConsoSecuredSdk} from './client/SignalConsoSecuredSdk'
import {ApiClient} from './client/ApiClient'
import {SignalConsoPublicSdk} from './client/SignalConsoPublicSdk'
import {CompanyPublicSdk} from './client/CompanyPublicSdk'

export type SignalConsoApiSdk = ReturnType<typeof makeSecuredSdk>

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

const baseUrl = config.apiBaseUrl + '/api'
const companyBaseUrl = config.companyApiBaseUrl + '/api'

export const apiPublicSdk = new SignalConsoPublicSdk(
  new ApiClient({
    baseUrl,
    headers,
  }),
)

export const makeSecuredSdk = () => ({
  public: apiPublicSdk,
  companySdk: new CompanyPublicSdk(
    new ApiClient({
      baseUrl: companyBaseUrl,
      headers,
    }),
  ),
  publicConnected: new SignalConsoPublicSdk(
    new ApiClient({
      baseUrl,
      headers,
      withCredentials: true,
    }),
  ),
  secured: new SignalConsoSecuredSdk(
    new ApiClient({
      baseUrl,
      headers,
      withCredentials: true,
    }),
  ),
})
