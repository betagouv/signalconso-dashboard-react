import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {ApiError, CompanySearchResult, Report} from '../api'

export interface ReportContextProps {
  get: UseFetcher<SignalConsoApiSdk['secured']['reports']['getById'], ApiError>
  remove: UseFetcher<SignalConsoApiSdk['secured']['reports']['remove'], ApiError>
  download: UseFetcher<SignalConsoApiSdk['secured']['reports']['download'], ApiError>
  events: UseFetcher<SignalConsoApiSdk['secured']['events']['getByReportId'], ApiError>
  companyEvents: UseFetcher<SignalConsoApiSdk['secured']['events']['getBySiret'], ApiError>
  updateCompany: UseFetcher<SignalConsoApiSdk['secured']['reports']['updateReportCompany'], ApiError>
  updateConsumer: UseFetcher<SignalConsoApiSdk['secured']['reports']['updateReportConsumer'], ApiError>
  postAction: UseFetcher<SignalConsoApiSdk['secured']['reports']['postAction']>
  postResponse: UseFetcher<SignalConsoApiSdk['secured']['reports']['postResponse']>
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
  const events = useFetcher(api.secured.events.getByReportId)
  const companyEvents = useFetcher(api.secured.events.getBySiret)
  const download = useFetcher(api.secured.reports.download)
  const postAction = useFetcher(api.secured.reports.postAction)
  const postResponse = useFetcher(api.secured.reports.postResponse)

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
        events,
        companyEvents,
        download,
        updateCompany,
        updateConsumer,
        postAction,
        postResponse,
      }}
    >
      {children}
    </ReportContext.Provider>
  )
}

export const useReportContext = (): ReportContextProps => {
  return useContext<ReportContextProps>(ReportContext)
}
