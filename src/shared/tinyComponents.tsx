import ReportSearchNavLink from '../feature/Report/ReportSearchNavLink'
import React from 'react'
import { Link } from 'react-router'

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
      <Link onClick={() => window.open(websiteURL, '_blank')} to={''}>
        <span className="text-sm">(voir le site)</span>
      </Link>
    </div>
  )
}
