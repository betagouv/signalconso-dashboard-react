import {Id, ResponseConsumerReview, ResponseConsumerReviewExists} from '../../model'
import {ApiClientApi} from '../ApiClient'

export class PublicReportClient {
  constructor(private client: ApiClientApi) {}

  readonly postReviewOnReportResponse = (reportId: Id, review: ResponseConsumerReview) => {
    return this.client.post<void>(`/reports/${reportId}/response/review`, {body: review})
  }

  readonly reviewExists = (reportId: Id) => {
    return this.client.get<ResponseConsumerReviewExists>(`/reports/${reportId}/response/review/exists`)
  }
}
