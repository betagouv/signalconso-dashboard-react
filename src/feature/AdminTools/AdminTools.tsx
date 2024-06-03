import React from 'react'
import {ResendEmailsAdminTool} from './ResendEmailAdminTool'
import {DeleteSpamReportsAdminTool} from './DeleteSpamReportsAdminTool'

export const AdminTools = () => {
  return (
    <>
      <ResendEmailsAdminTool />
      <DeleteSpamReportsAdminTool />
    </>
  )
}
