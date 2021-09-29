import * as React from 'react'
import {ReactNode, useContext, useState} from 'react'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {ApiError, Id} from 'core/api'
import {SignalConsoApiSdk} from '../../App'
import {Period} from '../api/client/stats/Stats'

type StatSdk = SignalConsoApiSdk['secured']['companyStats']

export interface ReportsCountByDate {
  date: Date
  count: number
  countResponded: number
}

export interface StatsContextProps {
  reportsCountEvolutionPeriod?: Period,
  reportsCountCurve: UseFetcher<(id: Id, period: Period) => Promise<ReportsCountByDate[]>, ApiError>
  tags: UseFetcher<StatSdk['getTags'], ApiError>
  status: UseFetcher<StatSdk['getStatus'], ApiError>
  responseReviews: UseFetcher<StatSdk['getResponseReviews'], ApiError>
  readDelay: UseFetcher<StatSdk['getReadDelay'], ApiError>
  responseDelay: UseFetcher<StatSdk['getResponseDelay'], ApiError>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<StatsContextProps> = {}

const StatsContext = React.createContext<StatsContextProps>(defaultContext as StatsContextProps)

export const StatsProvider = ({api, children}: Props) => {
  const [reportsCountEvolutionPeriod, setReportsCountEvolutionPeriod] = useState<undefined | Period>()
  const reportsCountCurve = useFetcher(async (id: Id, period: Period): Promise<ReportsCountByDate[]> => {
    setReportsCountEvolutionPeriod(period)
    const [reports, reportsResponded] = await Promise.all([
      api.secured.companyStats.getReportsCountCurve(id, period),
      api.secured.companyStats.getReportsRespondedCountCurve(id, period),
    ])
    return reports.map(_ => {
      const countResponded = reportsResponded.find(_1 => _1.date.getTime() - _.date.getTime() === 0)?.count
      if(!countResponded) {
        throw new Error(`Cannot find a match of ${_.date} from 'getReportsCountCurve' in 'getReportsRespondedCountCurve'.`)
      }
      return ({
        date: _.date,
        count: _.count,
        countResponded: reportsResponded.find(_1 => _1.date.getTime() - _.date.getTime() === 0)?.count ?? 0,
      })
    })
  })
  const tags = useFetcher(api.secured.companyStats.getTags)
  const status = useFetcher(api.secured.companyStats.getStatus)
  const responseReviews = useFetcher(api.secured.companyStats.getResponseReviews)
  const readDelay = useFetcher(api.secured.companyStats.getReadDelay)
  const responseDelay = useFetcher(api.secured.companyStats.getResponseDelay)

  return (
    <StatsContext.Provider
      value={{
        reportsCountEvolutionPeriod,
        reportsCountCurve,
        tags,
        status,
        responseReviews,
        readDelay,
        responseDelay,
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}

export const useStatsContext = (): StatsContextProps => {
  return useContext<StatsContextProps>(StatsContext)
}
