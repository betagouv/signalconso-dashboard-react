import React from 'react'
import { ResendEmailsAdminTool } from './ResendEmailAdminTool'
import { DeleteSpamReportsAdminTool } from './DeleteSpamReportsAdminTool'
import { BlacklistedIpsTool } from './BlacklistedIpsTool'
import { LogAs } from './LogAs'

export const AdminTools = () => {
  return (
    <>
      <ResendEmailsAdminTool />
      <DeleteSpamReportsAdminTool />
      <BlacklistedIpsTool />
      <LogAs />
    </>
  )
}
