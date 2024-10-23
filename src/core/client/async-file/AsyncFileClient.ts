import { addHours } from 'date-fns'
import { ApiClient } from '../ApiClient'
import { AsyncFile, AsyncFileStatus } from './AsyncFile'

export class AsyncFileClient {
  constructor(private client: ApiClient) {}

  private static readonly fileGenerationTimeoutHours = 1

  readonly fetch = () => {
    return this.client.get<AsyncFile[]>(`/async-files`).then((result) =>
      result.map((_) => {
        const creationDate = new Date(_.creationDate)
        return {
          ..._,
          creationDate,
          status: AsyncFileClient.getStatus(_),
        }
      }),
    )
  }

  private static readonly getStatus = (file: AsyncFile): AsyncFileStatus => {
    if (file.filename) {
      return AsyncFileStatus.Successed
    }
    const creationDate = new Date(file.creationDate)
    return new Date().getTime() >
      addHours(
        creationDate,
        AsyncFileClient.fileGenerationTimeoutHours,
      ).getTime()
      ? AsyncFileStatus.Failed
      : AsyncFileStatus.Loading
  }
}
