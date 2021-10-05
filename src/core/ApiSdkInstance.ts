import {Config} from '../conf/config'
import {ApiClient, SignalConsoPublicSdk, SignalConsoSecuredSdk} from '@betagouv/signalconso-api-sdk-js'

export type SignalConsoApiSdk = ReturnType<typeof makeSecuredSdk>

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

const baseUrl = Config.apiBaseUrl + '/api'

export const apiPublicSdk = new SignalConsoPublicSdk(
  new ApiClient({
    baseUrl,
    headers,
  }),
)

export const makeSecuredSdk = (token: string) => ({
  public: apiPublicSdk,
  secured: new SignalConsoSecuredSdk(
    new ApiClient({
      baseUrl,
      headers: {...headers, 'X-Auth-Token': token},
    }),
  ),
})
