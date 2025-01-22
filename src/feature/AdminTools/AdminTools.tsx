import { BlacklistedIpsTool } from './BlacklistedIpsTool'
import { DeleteSpamReportsAdminTool } from './DeleteSpamReportsAdminTool'
import { LogAs } from './LogAs'
import { RegenSampleData } from './RegenSampleData'
import { ResendEmailsAdminTool } from './ResendEmailAdminTool'

export const AdminTools = () => {
  return (
    <>
      <div className="grid lg:grid-cols-2 gap-2">
        <LogAs />
        <RegenSampleData />
      </div>
      <ResendEmailsAdminTool />
      <DeleteSpamReportsAdminTool />
      <BlacklistedIpsTool />
    </>
  )
}
