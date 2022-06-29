import {CurveStatsParams, Id, ReportStatus} from '@signal-conso/signalconso-api-sdk-js'
import {useFetcher} from '../../alexlibs/react-hooks-lib'
import React from 'react'
import {useLogin} from '../../core/context/LoginContext'

export const useCompanyStats = (id: Id) => {
  const {apiSdk: api} = useLogin()
  return {
    reportCount: useFetcher(() => api.publicConnected.stats.getReportCount({companyIds: [id]})),
    tags: useFetcher(() => api.secured.stats.getTags(id)),
    status: useFetcher(() => api.secured.stats.getStatus(id)),
    statusPro: useFetcher(() => api.secured.stats.getProStatus(id)),
    responseReviews: useFetcher(() => api.secured.stats.getResponseReviews(id)),
    readDelay: useFetcher(() => api.secured.stats.getReadDelay(id)),
    responseDelay: useFetcher(() => api.secured.stats.getResponseDelay(id)),
    curve: {
      reportCount: useFetcher((_: CurveStatsParams) => api.publicConnected.stats.getReportCountCurve({companyIds: [id], ..._})),
      reportRespondedCount: useFetcher((_: CurveStatsParams) =>
        api.publicConnected.stats.getReportCountCurve({
          ..._,
          companyIds: [id],
          status: [ReportStatus.PromesseAction, ReportStatus.Infonde, ReportStatus.MalAttribue],
        }),
      ),
      reportForwardedPercentage: useFetcher((_: CurveStatsParams) =>
        api.public.stats.percentageCurve.getReportForwardedPercentage({companyId: id, ..._}),
      ),
      reportRespondedPercentage: useFetcher((_: CurveStatsParams) =>
        api.public.stats.percentageCurve.getReportRespondedPercentage({companyId: id, ..._}),
      ),
      reportReadPercentage: useFetcher((_: CurveStatsParams) =>
        api.public.stats.percentageCurve.getReportReadPercentage({companyId: id, ..._}),
      ),
    },
    percentage: {
      reportForwardedToPro: useFetcher(() => api.public.stats.percentage.getReportForwardedToPro(id)),
      reportReadByPro: useFetcher(() => api.public.stats.percentage.getReportReadByPro(id)),
      reportWithResponse: useFetcher(() => api.public.stats.percentage.getReportWithResponse(id)),
      reportWithWebsite: useFetcher(() => api.public.stats.percentage.getReportWithWebsite(id)),
    },
  }
}
