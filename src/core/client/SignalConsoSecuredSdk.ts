import {
  CompanyAccessClient,
  CompanyClient,
  ConstantClient,
  EventClient,
  ReportedPhoneClient,
  ReportsClient,
  SubscriptionClient,
  UserClient,
  WebsiteClient,
} from '.'
import {AccessesClient} from './accesses/AccessesClient'
import {AdminClient} from './admin/AdminClient'
import {ApiClientApi} from './ApiClient'
import {AsyncFileClient} from './async-file/AsyncFileClient'
import {ReportBlockedNotificationClient} from './blocked-report-notifications/ReportBlockedNotificationClient'
import {CompanyAccessTokenClient} from './company-access-token/CompanyAccessTokenClient'
import {ConsumerBlacklistClient} from './consumer-blacklist/ConsumerBlacklistClient'
import {ConsumerEmailValidationClient} from './consumer-email-validation/ConsumerEmailValidationClient'
import {SecuredFileClient} from './file/SecuredFileClient'
import {StatsClient} from './stats/StatsClient'
import {SiretExtractorClient} from './siret-extractor/SiretExtractorClient'
import {GS1Client} from './gs1/GS1Client'

export class SignalConsoSecuredSdk {
  constructor(private client: ApiClientApi) {}

  readonly admin = new AdminClient(this.client)
  readonly accesses = new AccessesClient(this.client)
  readonly website = new WebsiteClient(this.client)
  readonly reportedPhone = new ReportedPhoneClient(this.client)
  readonly constant = new ConstantClient(this.client)
  readonly subscription = new SubscriptionClient(this.client)
  readonly company = new CompanyClient(this.client)
  readonly consumerEmailValidation = new ConsumerEmailValidationClient(this.client)
  readonly consumerBlacklist = new ConsumerBlacklistClient(this.client)
  readonly stats = new StatsClient(this.client)
  readonly companyAccess = new CompanyAccessClient(this.client)
  readonly companyAccessToken = new CompanyAccessTokenClient(this.client)
  readonly reports = new ReportsClient(this.client)
  readonly events = new EventClient(this.client)
  readonly asyncFiles = new AsyncFileClient(this.client)
  readonly user = new UserClient(this.client)
  readonly document = new SecuredFileClient(this.client)
  readonly reportBlockedNotification = new ReportBlockedNotificationClient(this.client)
  readonly siretExtractor = new SiretExtractorClient(this.client)
  readonly gs1 = new GS1Client(this.client)
}
