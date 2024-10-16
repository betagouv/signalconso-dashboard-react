import {
  Country,
  FileOrigin,
  GeoArea,
  Id,
  Region,
  TokenInfo,
  UploadedFile,
  User,
  UserToActivate,
} from 'core/model'
import { ApiClient } from './ApiClient'
import { CategoriesByStatus } from './constant/Category'
import { rawGeoAreas } from './constant/geoAreas'
import { rawRegions } from './constant/regions'

// This file uses a weird getter pattern
// Nothing to worry about, it's just a trick to organize the methods into "namespaces" within the same class
export class SignalConsoPublicSdk {
  constructor(private apiClient: ApiClient) {}

  user = {
    activateAccount: (
      user: UserToActivate,
      token: string,
      companySiret?: string,
    ) => {
      return this.apiClient.post<User>(`/account/activation`, {
        body: {
          draftUser: user,
          token: token,
          ...(companySiret ? { companySiret } : {}),
        },
        withCredentials: true,
      })
    },

    fetchTokenInfo: (
      token: string,
      companySiret?: string,
    ): Promise<TokenInfo> => {
      if (companySiret) {
        return this.apiClient.get<TokenInfo>(
          `/accesses/${companySiret}/token`,
          {
            qs: {
              token: token,
            },
          },
        )
      } else {
        return this.apiClient.get<TokenInfo>(`/account/token`, {
          qs: {
            token: token,
          },
        })
      }
    },
  }

  public get constant() {
    return {
      getCountries: () => this.apiClient.get<Country[]>(`/constants/countries`),
      getCategoriesByStatus: () =>
        this.apiClient.get<CategoriesByStatus>(`/constants/categoriesByStatus`),
      getRegions: () => {
        // silly async call simulation, in case it case it gets moved to the API one day... (won't happen)
        return Promise.resolve(regions)
      },
      getDepartmentByCode: (code: string) => {
        // silly async call simulation, in case it case it gets moved to the API one day... (won't happen)
        return Promise.resolve(geoAreas.find((_) => _.code === code))
      },
    }
  }

  authenticate = {
    login: (login: string, password: string) => {
      return this.apiClient.post<User>(`/authenticate`, {
        body: { login, password },
        withCredentials: true,
      })
    },

    logAs: (userEmail: string) => {
      return this.apiClient.post<User>(`/log-as`, {
        body: { email: userEmail },
        withCredentials: true,
      })
    },

    logout: () => {
      return this.apiClient.post<User | undefined>(`/logout`, {
        withCredentials: true,
      })
    },

    getUser: () => {
      return this.apiClient.get<User>(`/current-user`, {
        withCredentials: true,
      })
    },

    forgotPassword: (login: string): Promise<void> => {
      return this.apiClient.post<void>(`/authenticate/password/forgot`, {
        body: { login },
      })
    },

    sendActivationLink: (siret: string, token: string, email: string) => {
      return this.apiClient.post<void>(
        `/accesses/${siret}/send-activation-link`,
        {
          body: { token, email },
        },
      )
    },

    validateEmail: (token: Id) => {
      return this.apiClient.post<User>(`/account/validate-email`, {
        body: { token },
        withCredentials: true,
      })
    },

    resetPassword: (password: string, token: string) => {
      return this.apiClient.post<void>(`/authenticate/password/reset`, {
        body: { password },
        qs: { token },
      })
    },
  }

  public get document() {
    return {
      getLink: (file: UploadedFile) =>
        `${this.apiClient.baseUrl}/reports/files/${file.id}/${encodeURI(
          file.filename,
        )}`,

      upload: (file: File, origin: FileOrigin) => {
        const fileFormData: FormData = new FormData()
        fileFormData.append('reportFile', file, file.name)
        fileFormData.append('reportFileOrigin', origin)
        // We need to put manually the header since axios 1.x https://github.com/axios/axios/issues/5556
        // There are other ways but this is the quickest
        return this.apiClient.post<UploadedFile>(`reports/files`, {
          body: fileFormData,
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      },
    }
  }
}

const regions: Region[] = rawRegions
  .map((region) => ({
    label: region.name,
    departments: rawGeoAreas
      .filter((_) => _.region_code === region.code)
      .map((_) => ({
        code: _.code,
        label: _.name,
      }))
      .sort((r1, r2) => r1.code.localeCompare(r2.code)),
  }))
  .sort((r1, r2) => r1.label.localeCompare(r2.label))

const geoAreas: GeoArea[] = rawGeoAreas.map((_) => ({
  code: _.code,
  label: _.name,
}))
