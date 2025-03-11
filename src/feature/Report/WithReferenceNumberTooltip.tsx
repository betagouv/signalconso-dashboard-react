import { Icon, Tooltip } from '@mui/material'
import { ReactNode } from 'react'
import { useI18n } from '../../core/i18n'

export function WithReferenceNumberTooltip({
  children,
}: {
  children: ReactNode
}) {
  const { m } = useI18n()
  return (
    <Tooltip arrow title={m.reportConsumerReferenceNumberDesc}>
      <span className="cursor-pointer">
        {children}
        <Icon fontSize="small" sx={{ mb: -0.5, ml: 0.5 }}>
          help_outline
        </Icon>
      </span>
    </Tooltip>
  )
}
