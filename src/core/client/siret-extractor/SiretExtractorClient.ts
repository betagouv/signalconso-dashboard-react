import { ApiClient } from '../ApiClient'
import { ExtractionResult } from './SiretExtraction'

export class SiretExtractorClient {
  constructor(private client: ApiClient) {}

  readonly extractSiret = (website: string): Promise<ExtractionResult> => {
    return this.client.post<ExtractionResult>(`/extract-siret`, {
      body: {
        website,
      },
    })
  }
}
