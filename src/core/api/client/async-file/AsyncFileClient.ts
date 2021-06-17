import {ApiClientApi} from '../..'
import {AsyncFile, AsyncFileStatus, AsyncFileType} from './AsyncFile'
import {addDays} from 'date-fns'

export class AsyncFileClient {

  constructor(private client: ApiClientApi) {
  }

  readonly fetch = () => {
    return this.client.get<AsyncFile[]>(`/async-files`).then(result => result.map(_ => {
      const creationDate = new Date(_.creationDate)
      return {
        ..._,
        creationDate,
        type: AsyncFileClient.getFileType(_),
        status: _.filename
          ? AsyncFileStatus.Successed
          : new Date().getTime() > addDays(creationDate, 1).getTime()
            ? AsyncFileStatus.Failed
            : AsyncFileStatus.Loading
      }
    }))
  }

  private static readonly getFileType = (file: AsyncFile): AsyncFileType => {
    if (file.filename.startsWith('signalements')) {
      return AsyncFileType.Reports
    }
    if (file.filename.startsWith('sites-non-identifies')) {
      return AsyncFileType.ReportedWebsites
    }
    return AsyncFileType.ReportedPhones
  }
}
