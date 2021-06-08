import {CompanyClient, ConstantClient, ReportedPhoneClient, ReportsClient, SubscriptionClient, WebsiteClient} from './client'
import {ApiClientApi} from './core/ApiClient'
import {EventClient} from './client/event/EventClient'

export class SignalConsoSecuredSdk {

  constructor(private client: ApiClientApi) {
  }

  readonly website = new WebsiteClient(this.client)
  readonly reportedPhone = new ReportedPhoneClient(this.client)
  readonly constant = new ConstantClient(this.client)
  readonly subscription = new SubscriptionClient(this.client)
  readonly company = new CompanyClient(this.client)
  readonly reports = new ReportsClient(this.client)
  readonly events = new EventClient(this.client)
}
