import { ApiClientApi } from '../ApiClient'
import { ExtractionResult } from './SiretExtraction'

export class SiretExtractorClient {
  constructor(private client: ApiClientApi) {}

  readonly extractSiret = (webiste: string): Promise<ExtractionResult> => {
    return this.client.post<ExtractionResult>(`/extract-siret`, {
      body: {
        website: webiste,
      },
    })
  }
}
