export function ReportWebsiteUrlLink({
  websiteURL,
  className = '',
}: {
  websiteURL: string
  className?: string
}) {
  return (
    <a
      href={websiteURL}
      target="_blank"
      rel="noreferrer"
      className={`text-scbluefrance break-all ${className}`}
    >
      {websiteURL}
    </a>
  )
}
