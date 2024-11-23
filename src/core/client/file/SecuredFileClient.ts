import { Id } from '../../model'
import { ApiClient } from '../ApiClient'
import { UploadedFile } from './UploadedFile'

export class SecuredFileClient {
  constructor(private client: ApiClient) {}

  readonly remove = (file: UploadedFile) => {
    return this.client.delete(`/reports/files/${file.id}/${file.filename}`)
  }

  readonly listFiles = (fileIds: Id[]) => {
    return this.client.post<UploadedFile[]>(`/reports/files/list`, {
      body: fileIds,
    })
  }
}
