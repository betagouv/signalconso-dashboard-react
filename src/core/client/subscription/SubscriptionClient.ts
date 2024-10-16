import { Id, Subscription, SubscriptionCreate } from '../../model'
import { ApiClient } from '../ApiClient'
import { SignalConsoPublicSdk } from '../SignalConsoPublicSdk'

const fromApi =
  (client: ApiClient) =>
  async (
    // badly named : I think this is supposed to be the subscription object raw from the api
    api: any,
  ): Promise<Subscription> => {
    // completely silly : we instantiate the whole Sdk class, just to get something that is actually hardcoded underneath
    const getDepartmentByCode = new SignalConsoPublicSdk(client).constant
      .getDepartmentByCode
    const departments = await Promise.all(
      (api.departments || []).map(getDepartmentByCode),
    )
    return {
      ...api,
      categories: api.categories ?? [],
      sirets: api.sirets ?? [],
      countries: api.countries ?? [],
      tags: api.tags ?? [],
      departments,
    }
  }

const toApi = (subscription: Partial<SubscriptionCreate>): any => subscription

export class SubscriptionClient {
  constructor(private client: ApiClient) {}

  readonly list = (): Promise<Subscription[]> => {
    return this.client
      .get<Subscription[]>(`/subscriptions`)
      .then((_) => Promise.all(_.map(fromApi(this.client))))
  }

  readonly get = (id: Id) => {
    return this.client
      .get<Subscription>(`/subscriptions/${id}`)
      .then(fromApi(this.client))
  }

  readonly create = (
    body: SubscriptionCreate = {
      categories: [],
      departments: [],
      sirets: [],
      withTags: [],
      withoutTags: [],
      countries: [],
      frequency: 'P7D',
    },
  ) => {
    return this.client
      .post<Subscription>(`/subscriptions`, { body: toApi(body) })
      .then(fromApi(this.client))
  }

  readonly update = (id: Id, body: Partial<SubscriptionCreate>) => {
    return this.client
      .put<Subscription>(`/subscriptions/${id}`, { body: toApi(body) })
      .then(fromApi(this.client))
  }

  readonly remove = (id: Id) => {
    return this.client.delete<void>(`/subscriptions/${id}`)
  }
}
