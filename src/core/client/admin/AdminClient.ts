import { dateToApiTime, directDownloadBlob } from 'core/helper'
import { ApiClientApi } from '../ApiClient'
import { ResendEmailType } from './ResendEmailType'
import { Id } from '../../model'

export class AdminClient {
  constructor(private client: ApiClientApi) {}

  readonly getEmailCodes = () => {
    return this.client.get<string[]>(`/admin/test-email`)
  }

  readonly sendTestEmail = (templateRef: string, to: string) => {
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

  readonly resendEmails = (
    start: Date,
    end: Date,
    emailType: ResendEmailType,
  ) => {
    return this.client.post<void>(`/admin/emails/resend`, {
      qs: {
        start: dateToApiTime(start),
        end: dateToApiTime(end),
        emailType: emailType,
      },
    })
  }

  readonly deleteReports = (reportsId: Id[]) => {
    return this.client.delete<Id[]>(`/reports`, {
      body: reportsId,
    })
  }
}
