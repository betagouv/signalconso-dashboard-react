import { paginateData } from '../../helper'
import { Id, Paginate } from '../../model'
import { ApiClient } from '../ApiClient'
import {
  isUserActive,
  Role,
  RoleAdmins,
  RoleAgents,
  User,
  UserEdit,
  UserPending,
  UserRaw,
  UserSearch,
} from './User'

export class UserClient {
  constructor(private client: ApiClient) {}

  readonly searchAdmin = async (
    filters: UserSearch,
  ): Promise<Paginate<User>> => {
    const rawUsers = await this.client.get<UserRaw[]>(`/account/admin/users`)
    const users: User[] = rawUsers
      .map(({ lastEmailValidation, ...rest }) => {
        return {
          lastEmailValidation: new Date(lastEmailValidation),
          ...rest,
        }
      })
      .filter((_) => {
        return (
          !filters.email ||
          _.email.toLowerCase().includes(filters.email.toLowerCase())
        )
      })
      .filter((_) => {
        return (
          filters.active === undefined || isUserActive(_) === filters.active
        )
      })
    return paginateData<User>(filters.limit, filters.offset)(users)
  }

  readonly searchAgent = async (
    filters: UserSearch,
  ): Promise<Paginate<User>> => {
    const rawUsers = await this.client.get<UserRaw[]>(`/account/agent/users`)
    const users: User[] = rawUsers
      .map(({ lastEmailValidation, ...rest }) => {
        return {
          lastEmailValidation: new Date(lastEmailValidation),
          ...rest,
        }
      })
      .filter((_) => {
        return (
          !filters.email ||
          _.email.toLowerCase().includes(filters.email.toLowerCase())
        )
      })
      .filter((_) => {
        return (
          filters.active === undefined || isUserActive(_) === filters.active
        )
      })
      .filter((_) => {
        return (
          !filters.role ||
          filters.role.length === 0 ||
          filters.role.map((_) => _ as Role).includes(_.role)
        )
      })
    return paginateData<User>(filters.limit, filters.offset)(users)
  }

  readonly fetchPendingAgent = (role?: RoleAgents) => {
    const url = role
      ? `/account/agent/pending?role=${role}`
      : '/account/agent/pending'
    return this.client.get<UserPending[]>(url).then((_) =>
      _.map((_) => {
        _.tokenCreation = new Date(_.tokenCreation)
        _.tokenExpiration = new Date(_.tokenExpiration)
        return _
      }),
    )
  }

  readonly importAgents = (file: File, role: RoleAgents) => {
    const fileFormData: FormData = new FormData()
    fileFormData.append('emails', file, file.name)
    // We need to put manually the header since axios 1.x https://github.com/axios/axios/issues/5556
    // There are other ways but this is the quickest
    return this.client.post<void>(`/account/agent/invitations?role=${role}`, {
      body: fileFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  readonly inviteAgent = (email: string, role: RoleAgents) => {
    return this.client.post<void>(`/account/agent/invitation?role=${role}`, {
      body: { email },
    })
  }

  readonly inviteAdmin = (email: string, role: RoleAdmins) => {
    return this.client.post<void>(`/account/admin/invitation?role=${role}`, {
      body: { email },
    })
  }

  readonly changePassword = (oldPassword: string, newPassword: string) => {
    return this.client.post(`/account/password`, {
      body: { oldPassword, newPassword },
    })
  }

  readonly forceValidateEmail = (email: string) => {
    return this.client.post<void>(`/account/validate-email/${email}`, {})
  }

  readonly edit = (body: UserEdit) => {
    return this.client.put<User>(`/account`, { body })
  }

  readonly softDelete = (id: Id) => {
    return this.client.delete<void>(`/account/${id}`)
  }

  readonly sendEmailUpdateValidation = (email: string) => {
    return this.client.post<void>(`/account/send-email-update-validation`, {
      body: { email },
    })
  }

  readonly updateEmail = (token: string) => {
    return this.client.put<User>(`/account/update-email/${token}`)
  }
}
