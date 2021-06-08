import {ApiClientApi} from '../../index'
import {ReportStatus} from '../../model'

export class ConstantClient {

  constructor(private client: ApiClientApi) {
  }

  readonly getReportStatusList = () => this.client.get<ReportStatus[]>(`/constants/reportStatus`)
}
