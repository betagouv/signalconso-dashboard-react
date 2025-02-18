import { Id } from '../../model'
import { ApiClient } from '../ApiClient'
import { UploadedFile } from './UploadedFile'

export class SecuredFileClient {
  constructor(private client: ApiClient) {}

  readonly getUrlOfFileUsedInReport = (file: UploadedFile) =>
    `${this.client.baseUrl}/reports/files/used/${file.id}/${encodeURIComponent(
      file.filename,
    )}`

  readonly removeFileUsedInReport = (file: UploadedFile) => {
    return this.client.delete(
      `/reports/files/used/${file.id}/${encodeURIComponent(file.filename)}`,
    )
  }

  readonly listFiles = (fileIds: Id[]) => {
    return this.client.post<UploadedFile[]>(`/reports/files/list`, {
      body: fileIds,
    })
  }
}
