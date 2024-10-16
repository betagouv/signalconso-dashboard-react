import { config } from '../conf/config'
import { ApiClientHeaders } from './client/ApiClient'
import { CompaniesApiSdk } from './client/CompanyPublicSdk'
import { PublicApiSdk } from './client/PublicApiSdk'
import { SecuredApiSdk } from './client/SignalConsoSecuredSdk'

export type ConnectedApiSdk = ReturnType<typeof buildConnectedApiSdks>

export const apiHeaders: ApiClientHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}
export const mainApiBaseUrl = config.apiBaseUrl + '/api'
export const companiesApiBaseUrl = config.companyApiBaseUrl + '/api'

export const publicApiSdk = new PublicApiSdk()
const companiesApiSdk = new CompaniesApiSdk()

export const buildConnectedApiSdks = ({
  onDisconnected,
}: {
  onDisconnected: () => void
}) => {
  return {
    public: publicApiSdk,
    companies: companiesApiSdk,
    secured: new SecuredApiSdk({ onDisconnected }),
  }
}
