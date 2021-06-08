import axios, {AxiosError, AxiosResponse} from 'axios'
import {ApiSdkLogger} from '../helper/Logger'
import * as qs from 'qs'

export interface RequestOption {
  readonly qs?: any
  readonly headers?: any
  readonly body?: any
  readonly timeout?: number
}

export interface ApiClientParams {
  readonly baseUrl: string
  readonly headers?: any
  readonly requestInterceptor?: (options?: RequestOption) => Promise<RequestOption> | RequestOption
  readonly proxy?: string
  readonly mapData?: (_: any) => any
  readonly mapError?: (_: any) => never
}

export interface ApiClientApi {
  readonly baseUrl: string
  readonly get: <T = any>(uri: string, options?: RequestOption) => Promise<T>
  readonly post: <T = any>(uri: string, options?: RequestOption) => Promise<T>
  readonly delete: <T = any>(uri: string, options?: RequestOption) => Promise<T>
  readonly put: <T = any>(uri: string, options?: RequestOption) => Promise<T>
}

export type StatusCode =
  200 |
  301 |
  302 |
  400 |
  401 |
  403 |
  404 |
  500 |
  504;

export class ApiError extends Error {
  constructor(public code: StatusCode, public message: string, public error?: Error) {
    super(message);
  }
}

export type Method = 'POST' | 'GET' | 'PUT' | 'DELETE';

export class ApiClient {

  private readonly fetch: (method: Method, url: string, options?: RequestOption) => Promise<any>

  readonly baseUrl: string

  constructor({
    baseUrl,
    headers,
    requestInterceptor,
    mapData,
    mapError,
  }: ApiClientParams) {
    const client = axios.create({
      baseURL: baseUrl,
      headers: {...headers,},
    })

    this.baseUrl = baseUrl

    this.fetch = async (method: Method, url: string, options?: RequestOption) => {
      const builtOptions = await ApiClient.buildOptions(options, headers, requestInterceptor)
      return client.request({
        method,
        url,
        headers: builtOptions?.headers,
        params: options?.qs,
        data: options?.body,
        paramsSerializer: (params) => qs.stringify(params, {arrayFormat: 'repeat'})
      }).then(mapData ?? ((_: AxiosResponse) => _.data))
        .catch(mapError ?? ((_: AxiosError) => {
          ApiSdkLogger.error('[ApiClient]', _)
          const errorMessage = (() => {
            switch (_.response?.status) {
              case 400:
                return 'BAD_REQUEST'
              default:
                return _.response?.data
            }
          })()
          throw new ApiError(_.response?.status as StatusCode, errorMessage)
        }));
    };
  }

  private static readonly buildOptions = async (
    options?: RequestOption,
    headers?: any,
    requestInterceptor: (_?: RequestOption) => RequestOption | Promise<RequestOption> = _ => _!
  ): Promise<RequestOption> => {
    const interceptedOptions = await requestInterceptor(options);
    return {
      ...interceptedOptions,
      headers: {...headers, ...interceptedOptions?.headers},
    };
  };

  readonly get = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.fetch('GET', uri, options);
  };

  readonly post = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.fetch('POST', uri, options);
  };

  readonly delete = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.fetch('DELETE', uri, options);
  };

  readonly put = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.fetch('PUT', uri, options);
  };
}
