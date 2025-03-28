import * as React from 'react'
import { useContext } from 'react'
import {
  formatDate,
  formatDateTime,
  formatLargeNumber,
  formatTime,
} from '../../i18n/format'
import { fr } from '../../i18n/fr'

export const I18nContext = React.createContext<I18nContextShape>({} as any)

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
