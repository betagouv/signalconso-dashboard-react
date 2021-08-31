import {ApiClientApi, TokenInfo, UserToActivate} from '../..'

export class PublicUserClient {

    constructor(private client: ApiClientApi) {
    }

    readonly activateAccount = (user: UserToActivate, token: string, companySiret?: string) => {
        return this.client.post<void>(`/account/activation`, {
            body: {
                draftUser: user,
                token: token,
                ...(companySiret ? {companySiret} : {})
            }
        })
    }

    readonly fetchTokenInfo = (token: string): Promise<TokenInfo> => {
        return this.client.get<TokenInfo>(`/account/token`, {
            qs: {
                token: token,
            }
        })
    }
}
