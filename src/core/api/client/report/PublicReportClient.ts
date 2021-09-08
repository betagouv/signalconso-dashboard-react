import {Id, ReviewOnReportResponse} from '../../model'
import {ApiClientApi} from '../../core/ApiClient'

export class PublicReportClient {
  constructor(private client: ApiClientApi) {}

  readonly postReviewOnReportResponse = (reportId: Id, review: ReviewOnReportResponse) => {
    return this.client.post<void>(`/reports/${reportId}/response/review`, {body: review})
  }
}
