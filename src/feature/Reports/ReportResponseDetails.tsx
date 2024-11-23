import { Box, Tooltip } from '@mui/material'
import { ScOption } from 'core/helper/ScOption'
import { ExistingReportResponse } from 'core/model'
import React from 'react'
import { useI18n } from '../../core/i18n'
import { ProResponseLabel } from '../../shared/ProResponseLabel'

type ReportResponseDetailsProps = {
  details: ExistingReportResponse | { description: string } | null | undefined
}

export const ReportResponseDetails: React.FC<ReportResponseDetailsProps> = ({
  details,
}) => {
  const { m } = useI18n()
  if (details && 'description' in details) {
    return <div>{details.description}</div>
  }

  return ScOption.from(details)
    .map((r) => (
      <Tooltip
        className=""
        title={
          <>
            <Box
              sx={{
                fontWeight: (t) => t.typography.fontWeightBold,
                fontSize: 'larger',
                mb: 1,
              }}
            >
              {m.reportResponse[r.responseType]}
            </Box>
            <Box
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 20,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {r.consumerDetails}
            </Box>
            {r.dgccrfDetails && (
              <>
                <Box
                  sx={{
                    fontWeight: (t) => t.typography.fontWeightBold,
                    fontSize: 'larger',
                    mt: 4,
                    mb: 1,
                  }}
                >
                  {m.reportDgccrfDetails}
                </Box>
                <Box>{r.dgccrfDetails}</Box>
              </>
            )}
          </>
        }
      >
        <ProResponseLabel proResponse={r.responseType} />
      </Tooltip>
    ))
    .getOrElse(<></>)
}
