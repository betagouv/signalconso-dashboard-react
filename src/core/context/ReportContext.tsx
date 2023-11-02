import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher} from '../../alexlibs/react-hooks-lib'
import {SignalConsoApiSdk} from '../ApiSdkInstance'
import {Report, ReportConsumerUpdate} from '../client/report/Report'
import {CompanySearchResult} from '../client/company/Company'
import {ApiError} from '../client/ApiClient'
import {Country} from '../client/constant/Country'

export interface ReportContextProps {
  get: UseFetcher<SignalConsoApiSdk['secured']['reports']['getById'], ApiError>
  remove: UseFetcher<SignalConsoApiSdk['secured']['reports']['remove'], ApiError>
  reOpen: UseFetcher<SignalConsoApiSdk['secured']['reports']['reOpen'], ApiError>
  download: UseFetcher<SignalConsoApiSdk['secured']['reports']['download'], ApiError>
  updateCompany: UseFetcher<SignalConsoApiSdk['secured']['reports']['updateReportCompany'], ApiError>
  updateCountry: UseFetcher<SignalConsoApiSdk['secured']['reports']['updateReportCountry'], ApiError>
  updateConsumer: UseFetcher<SignalConsoApiSdk['secured']['reports']['updateReportConsumer'], ApiError>
  postAction: UseFetcher<SignalConsoApiSdk['secured']['reports']['postAction']>
  postResponse: UseFetcher<SignalConsoApiSdk['secured']['reports']['postResponse']>
  getReviewOnReportResponse: UseFetcher<SignalConsoApiSdk['secured']['reports']['getReviewOnReportResponse']>
  generateConsumerNotificationAsPDF: UseFetcher<
    SignalConsoApiSdk['secured']['reports']['generateConsumerNotificationAsPDF'],
    ApiError
  >
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
  const reOpen = useFetcher(api.secured.reports.reOpen)
  const download = useFetcher(api.secured.reports.download)
  const postAction = useFetcher(api.secured.reports.postAction)
  const postResponse = useFetcher(api.secured.reports.postResponse)
  const getReviewOnReportResponse = useFetcher(api.secured.reports.getReviewOnReportResponse)
  const generateConsumerNotificationAsPDF = useFetcher(api.secured.reports.generateConsumerNotificationAsPDF)

  const updateReport = (report: Report) => get.setEntity(prev => ({report, files: prev?.files ?? []}))

  const updateCompany = useFetcher((reportId: string, company: CompanySearchResult) =>
    api.secured.reports.updateReportCompany(reportId, company).then(updateReport),
  )
  const updateCountry = useFetcher((reportId: string, country: Country) =>
    api.secured.reports.updateReportCountry(reportId, country).then(updateReport),
  )
  const updateConsumer = useFetcher((reportId: string, reportConsumerUpdate: ReportConsumerUpdate) =>
    api.secured.reports.updateReportConsumer(reportId, reportConsumerUpdate).then(updateReport),
  )

  return (
    <ReportContext.Provider
      value={{
        get,
        remove,
        reOpen,
        download,
        updateCompany,
        updateCountry,
        updateConsumer,
        postAction,
        postResponse,
        getReviewOnReportResponse,
        generateConsumerNotificationAsPDF,
      }}
    >
      {children}
    </ReportContext.Provider>
  )
}

export const useReportContext = (): ReportContextProps => {
  return useContext<ReportContextProps>(ReportContext)
}
