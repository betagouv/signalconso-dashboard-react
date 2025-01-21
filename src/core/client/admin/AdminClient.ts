import { dateToApiTime, directDownloadBlob } from 'core/helper'
import { Id } from '../../model'
import { ApiClient } from '../ApiClient'
import { ResendEmailType } from './ResendEmailType'

export class AdminClient {
  constructor(private client: ApiClient) {}

  readonly getEmailCodes = () => {
    return this.client.get<string[]>(`/admin/test-email`)
  }

  readonly sendTestEmail = ({ templateRef, to }: SendTestEmailParams) => {
    return this.client.post<void>(`/admin/test-email`, {
      qs: { templateRef, to },
    })
  }

  readonly getPdfCodes = () => {
    return this.client.get<string[]>(`/admin/test-pdf`)
  }

  readonly downloadTestPdf = (templateRef: string) => {
    return this.client
      .postGetPdf(`/admin/test-pdf`, { qs: { templateRef } })
      .then(
        directDownloadBlob(`${templateRef}_${Date.now()}`, 'application/pdf'),
      )
  }

  readonly resendEmails = ({ start, end, emailType }: ResendEmailsParams) => {
    return this.client.post<void>(`/admin/emails/resend`, {
      qs: {
        start: dateToApiTime(start),
        end: dateToApiTime(end),
        emailType,
      },
    })
  }

  readonly deleteReports = (reportsId: Id[]) => {
    return this.client.delete<Id[]>(`/reports`, {
      body: reportsId,
    })
  }

  readonly regenSampleData = () => {
    return this.client.post<void>(`/admin/regen-sample-data`)
  }
}

export type ResendEmailsParams = {
  start: Date
  end: Date
  emailType: ResendEmailType
}
export type SendTestEmailParams = {
  templateRef: string
  to: string
}
