import {directDownloadBlob} from 'core/helper'
import {ApiClientApi} from '../ApiClient'

export class AdminClient {
  constructor(private client: ApiClientApi) {}

  readonly getEmailCodes = () => {
    return this.client.get<string[]>(`/admin/test-email`)
  }

  readonly sendTestEmail = (templateRef: string, to: string) => {
    return this.client.post<void>(`/admin/test-email`, {qs: {templateRef, to}})
  }

  readonly getPdfCodes = () => {
    return this.client.get<string[]>(`/admin/test-pdf`)
  }

  readonly downloadTestPdf = (templateRef: string) => {
    return this.client.postGetPdf(`/admin/test-pdf`, {qs: {templateRef}}).then(directDownloadBlob(`${templateRef}_${Date.now()}`))
  }
}
