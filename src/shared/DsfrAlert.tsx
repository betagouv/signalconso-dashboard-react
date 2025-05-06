import { Icon } from '@mui/material'
import { ReactNode } from '@tanstack/react-router'
import {
  colorDsfrErrorRed,
  colorDsfrInfoBlue,
  colorDsfrSuccessGreen,
} from 'alexlibs/mui-extension/color'

// Imitates roughly https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/alerte
export function DsfrAlert({
  title,
  children,
  type = 'info',
}: {
  title: ReactNode
  children: ReactNode
  type?: 'info' | 'error' | 'success'
}) {
  const color =
    type === 'success'
      ? colorDsfrSuccessGreen
      : type === 'info'
        ? colorDsfrInfoBlue
        : colorDsfrErrorRed
  return (
    <div className="flex border" style={{ borderColor: color }}>
      <div className="py-4 px-2" style={{ backgroundColor: color }}>
        <Icon className="text-white">
          {type === 'success'
            ? 'check_circle'
            : type === 'info'
              ? 'info'
              : 'dangerous'}
        </Icon>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        {children}
      </div>
    </div>
  )
}

export function DsfrAlertSmall({ children }: { children: ReactNode }) {
  return (
    <div className="flex border" style={{ borderColor: colorDsfrInfoBlue }}>
      <div
        className=" pt-2 pb-1 px-2"
        style={{ backgroundColor: colorDsfrInfoBlue }}
      >
        <Icon className="text-white">info</Icon>
      </div>
      <div className="p-2">{children}</div>
    </div>
  )
}
