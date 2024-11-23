import { Box, Icon, Tooltip } from '@mui/material'
import { useI18n } from '../../core/i18n'

interface Props {
  consumerReferenceNumber?: string
}

export const ReportReferenceNumber = ({ consumerReferenceNumber }: Props) => {
  const { m } = useI18n()
  return consumerReferenceNumber ? (
    <Box>
      <Tooltip arrow title={m.reportConsumerReferenceNumberDesc}>
        <span className="pointer">
          <span>
            {m.reportConsumerReferenceNumber}
            <Icon fontSize="small" sx={{ mb: -0.5, ml: 0.5 }}>
              help_outline
            </Icon>{' '}
            :{' '}
          </span>
        </span>
      </Tooltip>
      <span>{consumerReferenceNumber}</span>
    </Box>
  ) : null
}
