import { QuickSmallReportSearchLink } from 'feature/Report/quickSmallLinks'
import { ReactNode } from 'react'

export function ReportWebsiteUrlLink({ websiteURL }: { websiteURL: string }) {
  return (
    <ReportElementRow label="Site">
      <a
        href={websiteURL}
        target="_blank"
        rel="noreferrer"
        className="text-base"
      >
        {websiteURL}
      </a>
      <QuickSmallReportSearchLink
        reportSearch={{
          websiteURL: websiteURL,
          hasWebsite: true,
        }}
      />
    </ReportElementRow>
  )
}

export function ReportElementsGrid({ children }: { children: ReactNode }) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-[auto_1fr] sm:gap-x-4 gap-y-1`}
    >
      {children}
    </div>
  )
}

export function ReportElementRow({
  label,
  children,
}: {
  label: ReactNode
  children: ReactNode
}) {
  return (
    <div className="sm:contents flex flex-col flex-wrap">
      <div className="text-gray-500">
        {label}
        <span className="sm:hidden"> :</span>
      </div>
      <div className="pl-2 sm:pl-0">{children}</div>
    </div>
  )
}
