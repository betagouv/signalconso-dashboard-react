import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {UseAsync} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoApiSdk} from '../../App'
import {useAsync} from '@alexandreannic/react-hooks-lib'

type Sdk = SignalConsoApiSdk['secured']['companiesDbSync']

export interface CompaniesDbSyncContextProps {
  startEtablissementFile: UseAsync<Sdk['startEtablissementFile']>
  startUniteLegaleFile: UseAsync<Sdk['startUniteLegaleFile']>
  cancelAllFiles: UseAsync<Sdk['cancelAllFiles']>
  cancelEtablissementFile: UseAsync<Sdk['cancelEtablissementFile']>
  cancelUniteLegaleFile: UseAsync<Sdk['cancelUniteLegaleFile']>
  getInfo: UseAsync<Sdk['getInfo']>
}

interface Props {
  children: ReactNode
  api: SignalConsoApiSdk
}

const defaultContext: Partial<CompaniesDbSyncContextProps> = {}

const CompaniesDbSyncContext = React.createContext<CompaniesDbSyncContextProps>(defaultContext as CompaniesDbSyncContextProps)

export const CompaniesDbSyncProvider = ({api, children}: Props) => {

  const startEtablissementFile = useAsync(api.secured.companiesDbSync.startEtablissementFile)
  const startUniteLegaleFile = useAsync(api.secured.companiesDbSync.startUniteLegaleFile)
  const cancelAllFiles = useAsync(api.secured.companiesDbSync.cancelAllFiles)
  const cancelEtablissementFile = useAsync(api.secured.companiesDbSync.cancelEtablissementFile)
  const cancelUniteLegaleFile = useAsync(api.secured.companiesDbSync.cancelUniteLegaleFile)
  const getInfo = useAsync((api.secured.companiesDbSync.getInfo))

  return (
    <CompaniesDbSyncContext.Provider
      value={{
        startEtablissementFile,
        startUniteLegaleFile,
        cancelAllFiles,
        cancelEtablissementFile,
        cancelUniteLegaleFile,
        getInfo,
      }}
    >
      {children}
    </CompaniesDbSyncContext.Provider>
  )
}

export const useCompaniesDbSyncContext = (): CompaniesDbSyncContextProps => {
  return useContext<CompaniesDbSyncContextProps>(CompaniesDbSyncContext)
}
