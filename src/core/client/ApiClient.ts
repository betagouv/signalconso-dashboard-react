import axios, { AxiosInstance, ResponseType, isAxiosError } from 'axios'
import * as qs from 'qs'

export type ApiClientHeaders = {
  'Content-Type'?: 'multipart/form-data' | 'application/json'
  Accept?: 'application/json'
}
interface RequestOptions {
  readonly qs?: unknown
  readonly headers?: ApiClientHeaders
  readonly body?: unknown
  readonly timeout?: number
  readonly responseType?: ResponseType
  readonly withCredentials?: boolean
}

interface ApiErrorDetails {
  // 300, 404, 500, etc.
  code?: number | undefined
  id?: string
  error?: Error
}

export class ApiError extends Error {
  public name = 'ApiError'

  constructor(
    public message: string,
    public details: ApiErrorDetails,
  ) {
    super(message)
  }
}

type Method = 'POST' | 'GET' | 'PUT' | 'DELETE'

export class ApiClient {
  readonly baseUrl: string
  private readonly headers?: ApiClientHeaders
  private readonly withCredentials?: boolean
  private readonly onDisconnected?: () => void
  private readonly axiosClient: AxiosInstance

  constructor({
    baseUrl,
    headers,
    withCredentials,
    onDisconnected,
  }: {
    baseUrl: string
    headers?: ApiClientHeaders
    withCredentials?: boolean
    onDisconnected?: () => void
  }) {
    this.baseUrl = baseUrl
    this.headers = headers
    this.withCredentials = withCredentials
    this.onDisconnected = onDisconnected
    this.axiosClient = axios.create({
      baseURL: baseUrl,
      headers: { ...headers },
    })
  }

  private doAxiosRequest(
    method: Method,
    url: string,
    options?: RequestOptions,
  ): Promise<any> {
    const builtOptions = buildOptions(options, this.headers)
    return this.axiosClient
      .request({
        method,
        url,
        headers: builtOptions?.headers,
        params: options?.qs,
        data: options?.body,
        withCredentials: options?.withCredentials || this.withCredentials,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }),
      })
      .then((_) => _.data)
      .catch(toApiErrorAndRethrow)
      .catch(handleDisconnectedApiErrorAndRethrow(this.onDisconnected))
  }

  // TODO(Alex) Didn't find any way to download pdf with axios so I did it using fetch(), but it should exist.
  // note: this means that here we do not have the proper error handling ???
  private async doRequestUsingFetch(
    method: Method,
    url: string,
    options?: RequestOptions,
  ) {
    const builtOptions = buildOptions(options, this.headers)
    return fetch(
      this.baseUrl +
        url +
        (options?.qs
          ? `?${qs.stringify(options.qs, { arrayFormat: 'repeat' })}`
          : ''),
      {
        method,
        headers: builtOptions?.headers,
        body: builtOptions.body
          ? JSON.stringify(builtOptions?.body)
          : undefined,
        credentials:
          options?.withCredentials || this.withCredentials
            ? 'include'
            : undefined,
      },
    )
  }

  get<T>(uri: string, options?: RequestOptions): Promise<T> {
    return this.doAxiosRequest('GET', uri, options)
  }

  post<T>(uri: string, options?: RequestOptions): Promise<T> {
    return this.doAxiosRequest('POST', uri, options)
  }

  delete<T>(uri: string, options?: RequestOptions): Promise<T> {
    return this.doAxiosRequest('DELETE', uri, options)
  }

  put<T>(uri: string, options?: RequestOptions): Promise<T> {
    return this.doAxiosRequest('PUT', uri, options)
  }

  postGetPdf(url: string, options?: RequestOptions) {
    return this.doRequestUsingFetch('POST', url, options).then((_) => _.blob())
  }

  getBlob(url: string, options?: RequestOptions) {
    return this.doRequestUsingFetch('GET', url, options).then((_) => _.blob())
  }
}

function buildOptions(
  options?: RequestOptions,
  headers?: ApiClientHeaders,
): RequestOptions {
  return {
    ...options,
    headers: { ...headers, ...options?.headers },
  }
}

function toApiErrorAndRethrow(unknownError: any) {
  const _ = unknownError
  if (_.response && _.response.data) {
    // here we're reading the error structure often sent by the API
    // but not always ! the api is inconsistent (plus we have multiple apis now...)
    const message =
      _.response.data.details ??
      _.response.data.timeout ??
      JSON.stringify(_.response.data)
    throw new ApiError(message, {
      code: _.response.status,
      id: _.response.data.type,
      error: _,
    })
  } else if (isAxiosError(_)) {
    if (_.code === 'ERR_NETWORK') {
      throw new ApiError(
        `SignalConso est inaccessible, veuillez vérifier votre connexion.`,
        {
          error: _,
        },
      )
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
}

function handleDisconnectedApiErrorAndRethrow(
  onDisconnected: (() => void) | undefined,
) {
  return (err: ApiError) => {
    const scErrorCode = err.details.id
    if (scErrorCode && scErrorCode === 'SC-AUTH-BROKEN') {
      onDisconnected?.()
    }
    throw err
  }
}
