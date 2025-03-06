import { EventCategories } from 'core/plugins/Matomo'

import { ExportsActions } from 'core/plugins/Matomo'

import { User } from 'core/model'
import { trackEvent } from 'core/plugins/Matomo'

export const downloadTypes = ['reportWithAttachment', 'reportOnly'] as const
export type DownloadType = (typeof downloadTypes)[number]

export function trackReportDownload(user: User, downloadType: DownloadType) {
  trackEvent(
    user,
    EventCategories.Exports,
    downloadType === 'reportWithAttachment'
      ? ExportsActions.exportReportZip
      : ExportsActions.exportReportPdf,
  )
}
