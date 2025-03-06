import { ReactNode } from 'react'
import {
  formatDate,
  formatDateTime,
  formatLargeNumber,
  formatTime,
} from '../../i18n/format'
import { fr } from '../../i18n/fr'
import { I18nContext } from './i18nContext'

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
