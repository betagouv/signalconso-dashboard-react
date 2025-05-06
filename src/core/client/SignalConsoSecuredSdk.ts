import { apiHeaders, mainApiBaseUrl } from 'core/apiSdkInstances'
import {
  CompanyAccessClient,
  CompanyClient,
  EventClient,
  ReportedPhoneClient,
  ReportsClient,
  SubscriptionClient,
  UserClient,
  WebsiteClient,
} from '.'
import { AccessesMassManagementClient } from './accesses-mass-management/AccessesMassManagementClient'
import { AccessesClient } from './accesses/AccessesClient'
import { AdminClient } from './admin/AdminClient'
import { ApiClient } from './ApiClient'
import { AsyncFileClient } from './async-file/AsyncFileClient'
import { AuthAttemptClient } from './auth-attempts/AuthAttemptClient'
import { BarcodeClient } from './barcode/BarcodeClient'
import { ReportBlockedNotificationClient } from './blocked-report-notifications/ReportBlockedNotificationClient'
import { CompanyAccessTokenClient } from './company-access-token/CompanyAccessTokenClient'
import { ConsumerBlacklistClient } from './consumer-blacklist/ConsumerBlacklistClient'
import { ConsumerEmailValidationClient } from './consumer-email-validation/ConsumerEmailValidationClient'
import { EngagementClient } from './engagement/EngagementClient'
import { SecuredFileClient } from './file/SecuredFileClient'
import { IpBlacklistClient } from './ip-blacklist/IpBlacklistClient'
import { SiretExtractorClient } from './siret-extractor/SiretExtractorClient'
import { StatsClient } from './stats/StatsClient'

export class SecuredApiSdk {
  private client: ApiClient
  admin: AdminClient
  accesses: AccessesClient
  website: WebsiteClient
  reportedPhone: ReportedPhoneClient
  subscription: SubscriptionClient
  company: CompanyClient
  accessesMassManagement: AccessesMassManagementClient
  consumerEmailValidation: ConsumerEmailValidationClient
  authAttemptClient: AuthAttemptClient
  consumerBlacklist: ConsumerBlacklistClient
  ipBlacklist: IpBlacklistClient
  stats: StatsClient
  companyAccess: CompanyAccessClient
  companyAccessToken: CompanyAccessTokenClient
  reports: ReportsClient
  events: EventClient
  asyncFiles: AsyncFileClient
  user: UserClient
  document: SecuredFileClient
  reportBlockedNotification: ReportBlockedNotificationClient
  siretExtractor: SiretExtractorClient
  barcode: BarcodeClient
  engagement: EngagementClient

  constructor({ onDisconnected }: { onDisconnected: () => void }) {
    this.client = new ApiClient({
      baseUrl: mainApiBaseUrl,
      headers: apiHeaders,
      withCredentials: true,
      onDisconnected,
    })

    this.admin = new AdminClient(this.client)
    this.accesses = new AccessesClient(this.client)
    this.website = new WebsiteClient(this.client)
    this.reportedPhone = new ReportedPhoneClient(this.client)
    this.subscription = new SubscriptionClient(this.client)
    this.company = new CompanyClient(this.client)
    this.consumerEmailValidation = new ConsumerEmailValidationClient(
      this.client,
    )
    this.authAttemptClient = new AuthAttemptClient(this.client)
    this.consumerBlacklist = new ConsumerBlacklistClient(this.client)
    this.ipBlacklist = new IpBlacklistClient(this.client)
    this.stats = new StatsClient(this.client)
    this.companyAccess = new CompanyAccessClient(this.client)
    this.accessesMassManagement = new AccessesMassManagementClient(this.client)
    this.companyAccessToken = new CompanyAccessTokenClient(this.client)
    this.reports = new ReportsClient(this.client)
    this.events = new EventClient(this.client)
    this.asyncFiles = new AsyncFileClient(this.client)
    this.user = new UserClient(this.client)
    this.document = new SecuredFileClient(this.client)
    this.reportBlockedNotification = new ReportBlockedNotificationClient(
      this.client,
    )
    this.siretExtractor = new SiretExtractorClient(this.client)
    this.barcode = new BarcodeClient(this.client)
    this.engagement = new EngagementClient(this.client)
  }
}
