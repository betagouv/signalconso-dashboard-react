import ReportSearchNavLink from '../feature/Report/ReportSearchNavLink'
import React from 'react'

export function ReportWebsiteUrlLink({ websiteURL }: { websiteURL: string }) {
  return (
    <div className={'flex flex-row items-center gap-1 '}>
      <ReportSearchNavLink
        reportSearch={{
          websiteURL: websiteURL,
          hasWebsite: true,
        }}
        value={websiteURL}
      />
      <a target="_blank" href={websiteURL}>
        <span className="text-sm">(voir le site)</span>
      </a>
    </div>
  )
}
