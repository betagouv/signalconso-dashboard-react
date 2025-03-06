import { ApiError } from 'core/client/ApiClient'
import { noop } from 'lodash'
import * as React from 'react'
import { useContext } from 'react'

export type ToastContext = {
  toastError: (e: Partial<ApiError>) => void
  toastSuccess: (m: string) => void
  toastInfo: (m: string) => void
}

export const toastContext = React.createContext<ToastContext>({
  toastError: noop,
  toastSuccess: noop,
  toastInfo: noop,
})

export const useToast = () => useContext(toastContext)

export const apiErrorsCode = {
  'SC-0001': `Une erreur s'est produite`,
  'SC-0002': `L'utilisateur DGCCRF n'existe pas.`,
  'SC-0003': `Le professionnel n'existe pas.`,
  'SC-0004': `L'entreprise n'existe pas.`,
  'SC-0005': `Le site web n'existe pas.`,
  'SC-0006': `L'entreprise est déjà associée à un site.`,
  'SC-0007': `URL invalide.`,
  'SC-0008': `Email invalide pour ce type d'utilisateur.`,
  'SC-0009': `L'utilisateur existe déjà.`,
  'SC-0010': `L'entreprise a déjà été activée.`,
  'SC-0011': `L'entreprise n'existe pas.`,
  'SC-0012': `Le code d'activation est périmé.`,
  'SC-0013': `Le code d'activation est invalide.`,
} as const
