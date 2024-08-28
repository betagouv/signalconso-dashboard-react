import { UploadedFile } from './UploadedFile'
import { ApiClientApi } from '../ApiClient'
import { Id } from '../../model'

export class SecuredFileClient {
  constructor(private client: ApiClientApi) {}

  readonly remove = (file: UploadedFile) => {
    return this.client.delete(`/reports/files/${file.id}/${file.filename}`)
  }

  readonly listFiles = (fileIds: Id[]) => {
    return this.client.post<UploadedFile[]>(`/reports/files/list`, {
      body: fileIds,
    })
  }
}
