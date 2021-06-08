import {ApiClientApi, UploadedFile} from '../../index'

export class FileClient {

  constructor(private client: ApiClientApi) {
  }

  readonly getLink = (file: UploadedFile) => `${this.client.baseUrl}/reports/files/${file.id}/${encodeURI(file.filename)}`
}
