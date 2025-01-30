import ReportSearchNavLink from '../feature/Report/ReportSearchNavLink'
import React from 'react'
import { WebsiteTools } from '../feature/ReportedWebsites/WebsiteTools'

export function ReportWebsiteUrlLink({ websiteURL }: { websiteURL: string }) {
  return (
    <div className={'flex flex-row items-center '}>
      <ReportSearchNavLink
        reportSearch={{
          websiteURL: websiteURL,
          hasWebsite: true,
        }}
        value={websiteURL}
      />
      {/*<WebsiteTools website={websiteURL} />*/}
    </div>
  )
}
