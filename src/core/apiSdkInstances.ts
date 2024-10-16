import { config } from '../conf/config'
import { ApiClient, ApiClientHeaders } from './client/ApiClient'
import { CompanyPublicSdk } from './client/CompanyPublicSdk'
import { SignalConsoPublicSdk } from './client/SignalConsoPublicSdk'
import { SignalConsoSecuredSdk } from './client/SignalConsoSecuredSdk'

export type ConnectedApiSdk = ReturnType<typeof buildConnectedApiSdk>

const headers: ApiClientHeaders = {
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

export const buildConnectedApiSdk = ({
  onDisconnected,
}: {
  onDisconnected: () => void
}) => {
  return {
    public: apiPublicSdk,
    companies: new CompanyPublicSdk(
      new ApiClient({
        baseUrl: companyBaseUrl,
        headers,
      }),
    ),
    secured: new SignalConsoSecuredSdk(
      new ApiClient({
        baseUrl,
        headers,
        withCredentials: true,
        onDisconnected,
      }),
    ),
  }
}
