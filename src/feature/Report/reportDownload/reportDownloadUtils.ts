import { EventCategories } from 'core/plugins/Matomo'

import { ExportsActions } from 'core/plugins/Matomo'

import { User } from 'core/model'
import { trackEvent } from 'core/plugins/Matomo'

export function trackReportDownload(user: User) {
  trackEvent(user, EventCategories.Exports, ExportsActions.exportReportPdf)
}
