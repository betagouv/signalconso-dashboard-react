import * as React from 'react'
import { ReactNode, useContext } from 'react'
import {
  formatDate,
  formatDateTime,
  formatLargeNumber,
  formatTime,
} from './format'
import { fr } from './localization/fr'

const I18nContext = React.createContext<I18nContextShape>({} as any)

export type I18nContextShape = {
  m: (typeof fr)['messages']
  formatLargeNumber: typeof formatLargeNumber
  formatDate: typeof formatDate
  formatTime: typeof formatTime
  formatDateTime: typeof formatDateTime
}

// This context exists for legacy reasons
// There's no reason to use it anymore, we will never internationalize
// - Texts can be written directly inside the JSX
// - formatXXX() functions can be directly imported from format.ts
export const useI18n = () => useContext(I18nContext)

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  return (
    <I18nContext.Provider
      value={{
        m: fr.messages,
        formatLargeNumber,
        formatDate,
        formatTime,
        formatDateTime,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}
