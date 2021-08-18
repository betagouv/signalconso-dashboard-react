import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {CrudListCRD, useCrudList} from '@alexandreannic/react-hooks-lib/lib'
import {ApiError, Id} from 'core/api'
import {SignalConsoApiSdk} from '../../App'
import {BlockedReportNotification} from '../api/client/blockedReportNotifications/BlockedReportNotification'

export interface BlockedReportNotificationContextProps {
  crud: CrudListCRD<
    BlockedReportNotification,
    'companyId',
    {
      c: (companyId: Id) => Promise<BlockedReportNotification>
      r: () => Promise<BlockedReportNotification[]>
      d: (companyId: Id) => Promise<void>
    },
    ApiError
  >
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<BlockedReportNotificationContextProps> = {}

const BlockedReportNotificationContext = React.createContext<BlockedReportNotificationContextProps>(
  defaultContext as BlockedReportNotificationContextProps,
)

export const BlockedReportNotificationProvider = ({api, children}: Props) => {
  const crud = useCrudList('companyId', {
    r: () => api.secured.reportNotificationBlockList.fetch(),
    c: (companyId: Id) => api.secured.reportNotificationBlockList.create(companyId),
    d: (companyId: Id) => api.secured.reportNotificationBlockList.delete(companyId),
  })

  return (
    <BlockedReportNotificationContext.Provider
      value={{
        crud,
      }}
    >
      {children}
    </BlockedReportNotificationContext.Provider>
  )
}

export const useBlockedReportNotificationContext = (): BlockedReportNotificationContextProps => {
  return useContext<BlockedReportNotificationContextProps>(BlockedReportNotificationContext)
}
