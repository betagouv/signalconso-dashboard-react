import React from 'react'
import {ResendEmailsAdminTool} from './ResendEmailAdminTool'
import {DeleteSpamReportsAdminTool} from './DeleteSpamReportsAdminTool'
import {BlacklistedIpsTool} from './BlacklistedIpsTool'

export const AdminTools = () => {
  return (
    <>
      <ResendEmailsAdminTool />
      <DeleteSpamReportsAdminTool />
      <BlacklistedIpsTool />
    </>
  )
}
