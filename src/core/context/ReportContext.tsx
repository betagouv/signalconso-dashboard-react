import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher} from '../../alexlibs/react-hooks-lib'
import {ApiError, CompanySearchResult, Report} from '@signal-conso/signalconso-api-sdk-js'
import {SignalConsoApiSdk} from '../ApiSdkInstance'

export interface ReportContextProps {
  get: UseFetcher<SignalConsoApiSdk['secured']['reports']['getById'], ApiError>
  remove: UseFetcher<SignalConsoApiSdk['secured']['reports']['remove'], ApiError>
  download: UseFetcher<SignalConsoApiSdk['secured']['reports']['download'], ApiError>
  updateCompany: UseFetcher<SignalConsoApiSdk['secured']['reports']['updateReportCompany'], ApiError>
  updateConsumer: UseFetcher<SignalConsoApiSdk['secured']['reports']['updateReportConsumer'], ApiError>
  postAction: UseFetcher<SignalConsoApiSdk['secured']['reports']['postAction']>
  postResponse: UseFetcher<SignalConsoApiSdk['secured']['reports']['postResponse']>
  getReviewOnReportResponse: UseFetcher<SignalConsoApiSdk['secured']['reports']['getReviewOnReportResponse']>
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
  const updateConsumer = useFetcher(
    (reportId: string, firstName: string, lastName: string, email: string, contactAgreement: boolean) =>
      api.secured.reports.updateReportConsumer(reportId, firstName, lastName, email, contactAgreement).then(updateReport),
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
