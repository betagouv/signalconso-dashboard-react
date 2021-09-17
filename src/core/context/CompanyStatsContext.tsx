import * as React from 'react'
import {ReactNode, useContext, useState} from 'react'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {ApiError, Id} from 'core/api'
import {SignalConsoApiSdk} from '../../App'
import {ReportsCountEvolutionPeriod} from '../api/client/company-stats/CompanyStats'

type CompanyStatSdk = SignalConsoApiSdk['secured']['companyStats']

export interface CompaniesStatsContextProps {
  reportsCountEvolutionPeriod?: ReportsCountEvolutionPeriod,
  reportsCountEvolution: UseFetcher<CompanyStatSdk['getReportsCountEvolution'], ApiError>
  tags: UseFetcher<CompanyStatSdk['getTags'], ApiError>
  status: UseFetcher<CompanyStatSdk['getStatus'], ApiError>
  hosts: UseFetcher<CompanyStatSdk['getHosts'], ApiError>
  responseReviews: UseFetcher<CompanyStatSdk['getResponseReviews'], ApiError>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<CompaniesStatsContextProps> = {}

const CompaniesStatsContext = React.createContext<CompaniesStatsContextProps>(defaultContext as CompaniesStatsContextProps)

export const CompaniesStatsProvider = ({api, children}: Props) => {
  const [reportsCountEvolutionPeriod, setReportsCountEvolutionPeriod] = useState<undefined | ReportsCountEvolutionPeriod>()
  const reportsCountEvolution = useFetcher((id: Id, period: ReportsCountEvolutionPeriod) => {
    setReportsCountEvolutionPeriod(period)
    return api.secured.companyStats.getReportsCountEvolution(id, period)
  })
  const tags = useFetcher(api.secured.companyStats.getTags)
  const status = useFetcher(api.secured.companyStats.getStatus)
  const hosts = useFetcher(api.secured.companyStats.getHosts)
  const responseReviews = useFetcher(api.secured.companyStats.getResponseReviews)

  return (
    <CompaniesStatsContext.Provider
      value={{
        reportsCountEvolutionPeriod,
        reportsCountEvolution,
        tags,
        status,
        hosts,
        responseReviews,
      }}
    >
      {children}
    </CompaniesStatsContext.Provider>
  )
}

export const useCompaniesStatsContext = (): CompaniesStatsContextProps => {
  return useContext<CompaniesStatsContextProps>(CompaniesStatsContext)
}
