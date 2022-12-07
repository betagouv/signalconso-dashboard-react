import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {Fetcher, useFetcher} from '../../alexlibs/react-hooks-lib'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {Report, ReportConsumerUpdate} from '../client/report/Report'
import {CompanySearchResult} from '../client/company/Company'
import {ApiError} from '../client/ApiClient'

export interface ReportContextProps {
  get: Fetcher<SignalConsoApiSdk['secured']['reports']['getById'], ApiError>
  remove: Fetcher<SignalConsoApiSdk['secured']['reports']['remove'], ApiError>
  download: Fetcher<SignalConsoApiSdk['secured']['reports']['download'], ApiError>
  updateCompany: Fetcher<SignalConsoApiSdk['secured']['reports']['updateReportCompany'], ApiError>
  updateConsumer: Fetcher<SignalConsoApiSdk['secured']['reports']['updateReportConsumer'], ApiError>
  postAction: Fetcher<SignalConsoApiSdk['secured']['reports']['postAction']>
  postResponse: Fetcher<SignalConsoApiSdk['secured']['reports']['postResponse']>
  getReviewOnReportResponse: Fetcher<SignalConsoApiSdk['secured']['reports']['getReviewOnReportResponse']>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<ReportContextProps> = {}

const ReportContext = React.createContext<ReportContextProps>(defaultContext as ReportContextProps)

export const ReportProvider = ({api, children}: Props) => {
  const get = useFetcher(api.secured.reports.getById)
  const remove = useFetcher(api.secured.reports.remove)
  const download = useFetcher(api.secured.reports.download)
  const postAction = useFetcher(api.secured.reports.postAction)
  const postResponse = useFetcher(api.secured.reports.postResponse)
  const getReviewOnReportResponse = useFetcher(api.secured.reports.getReviewOnReportResponse)

  const updateReport = (report: Report) => get.setEntity(prev => ({report, files: prev?.files ?? []}))

  const updateCompany = useFetcher((reportId: string, company: CompanySearchResult) =>
    api.secured.reports.updateReportCompany(reportId, company).then(updateReport),
  )
  const updateConsumer = useFetcher((reportId: string, reportConsumerUpdate: ReportConsumerUpdate) =>
    api.secured.reports.updateReportConsumer(reportId, reportConsumerUpdate).then(updateReport),
  )

  return (
    <ReportContext.Provider
      value={{
        get,
        remove,
        download,
        updateCompany,
        updateConsumer,
        postAction,
        postResponse,
        getReviewOnReportResponse,
      }}
    >
      {children}
    </ReportContext.Provider>
  )
}

export const useReportContext = (): ReportContextProps => {
  return useContext<ReportContextProps>(ReportContext)
}
