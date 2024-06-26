import axios, {AxiosResponse, ResponseType, isAxiosError} from 'axios'
import * as qs from 'qs'

export interface RequestOption {
  readonly qs?: any
  readonly headers?: any
  readonly body?: any
  readonly timeout?: number
  readonly responseType?: ResponseType
  readonly withCredentials?: boolean
}

export interface ApiClientParams {
  readonly baseUrl: string
  readonly headers?: any
  readonly withCredentials?: boolean
  onDisconnected?: () => void
}

export interface ApiClientApi {
  readonly baseUrl: string
  readonly get: <T = any>(uri: string, options?: RequestOption) => Promise<T>
  readonly head: <T = any>(uri: string, options?: RequestOption) => Promise<T>
  readonly post: <T = any>(uri: string, options?: RequestOption) => Promise<T>
  readonly postGetPdf: <T = any>(uri: string, options?: RequestOption) => Promise<Blob>
  readonly getBlob: <T = any>(uri: string, options?: RequestOption) => Promise<Blob>
  readonly delete: <T = any>(uri: string, options?: RequestOption) => Promise<T>
  readonly put: <T = any>(uri: string, options?: RequestOption) => Promise<T>
  readonly patch: <T = any>(uri: string, options?: RequestOption) => Promise<T>
}

export type StatusCode = 'front-side' | 200 | 301 | 302 | 400 | 401 | 403 | 404 | 423 | 500 | 504

interface ApiErrorDetails {
  // 300, 404, 500, etc.
  code?: number | undefined
  id?: string
  error?: Error
}

export class ApiError extends Error {
  public name = 'ApiError'

  constructor(public message: string, public details: ApiErrorDetails) {
    super(message)
  }
}

export type Method = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD'

export class ApiClient {
  private readonly request: (method: Method, url: string, options?: RequestOption) => Promise<any>

  readonly postGetPdf: (url: string, options?: RequestOption) => Promise<Blob>

  readonly getBlob: (url: string, options?: RequestOption) => Promise<Blob>

  readonly baseUrl: string

  constructor({baseUrl, headers, withCredentials, onDisconnected}: ApiClientParams) {
    const client = axios.create({
      baseURL: baseUrl,
      headers: {...headers},
    })

    this.baseUrl = baseUrl

    this.request = async (method: Method, url: string, options?: RequestOption) => {
      const builtOptions = await ApiClient.buildOptions(options, headers)
      return client
        .request({
          method,
          url,
          headers: builtOptions?.headers,
          params: options?.qs,
          data: options?.body,
          withCredentials: options?.withCredentials || withCredentials,
          paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'}),
        })
        .then((_: AxiosResponse) => _.data)
        .catch((_: any) => {
          if (_.response && _.response.data) {
            // here we're reading the error structure often sent by the API
            // but not always ! the api is inconsistent (plus we have multiple apis now...)
            const message = _.response.data.details ?? _.response.data.timeout ?? JSON.stringify(_.response.data)
            throw new ApiError(message, {
              code: _.response.status,
              id: _.response.data.type,
              error: _,
            })
          } else if (isAxiosError(_)) {
            if (_.code === 'ERR_NETWORK') {
              throw new ApiError(`SignalConso est inaccessible, veuillez vérifier votre connexion.`, {
                error: _,
              })
            } else {
              // Fallback for a general HTTP error with a status code
              const status = _.response?.status
              if (status !== undefined) {
                const statusText = _.response?.statusText
                throw new ApiError(`Http error ${status} ${statusText}`, {
                  code: status,
                  error: _,
                })
              }
              // Then fallback to the very general error
            }
          }
          throw new ApiError(`Something not caught went wrong`, {
            error: _,
          })
        })
        .catch((e: ApiError) => {
          if (e.details.id === 'SC-AUTH') {
            onDisconnected?.()
          }
          throw e
        })
    }

    /**
     * TODO(Alex) Didn't find any way to download pdf with axios so I did it using fetch(), but it should exist.
     */
    const requestUsingFetchApi = async (method: Method, url: string, options?: RequestOption) => {
      const builtOptions = await ApiClient.buildOptions(options, headers)
      return fetch(baseUrl + url + (options?.qs ? `?${qs.stringify(options.qs, {arrayFormat: 'repeat'})}` : ''), {
        method,
        headers: builtOptions?.headers,
        body: builtOptions.body ? JSON.stringify(builtOptions?.body) : undefined,
        credentials: options?.withCredentials || withCredentials ? 'include' : undefined,
      })
    }

    this.postGetPdf = async (url: string, options?: RequestOption) => {
      return requestUsingFetchApi('POST', url, options).then(_ => _.blob())
    }

    this.getBlob = async (url: string, options?: RequestOption) => {
      return requestUsingFetchApi('GET', url, options).then(_ => _.blob())
    }
  }

  private static readonly buildOptions = async (options?: RequestOption, headers?: any): Promise<RequestOption> => {
    return {
      ...options,
      headers: {...headers, ...options?.headers},
    }
  }

  readonly get = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.request('GET', uri, options)
  }

  readonly head = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.request('HEAD', uri, options)
  }

  readonly post = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.request('POST', uri, options)
  }

  readonly delete = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.request('DELETE', uri, options)
  }

  readonly put = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.request('PUT', uri, options)
  }

  readonly patch = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.request('PATCH', uri, options)
  }
}
