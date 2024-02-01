import React from 'react'
import {Box, Tooltip} from '@mui/material'
import {ProResponseLabel} from '../../shared/ProResponseLabel'
import {useI18n} from '../../core/i18n'
import {ReportResponse} from '../../core/model'
import {ScOption} from 'core/helper/ScOption'

type ReportResponseDetailsProps = {
  details: ReportResponse | {description: string} | null | undefined
}

const ReportResponseDetails: React.FC<ReportResponseDetailsProps> = ({details}) => {
  const {m} = useI18n()
  if (details && 'description' in details) {
    return <div>{details.description}</div>
  }

  return ScOption.from(details)
    .map(r => (
      <Tooltip
        className=""
        title={
          <>
            <Box sx={{fontWeight: t => t.typography.fontWeightBold, fontSize: 'larger', mb: 1}}>
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
                <Box sx={{fontWeight: t => t.typography.fontWeightBold, fontSize: 'larger', mt: 4, mb: 1}}>
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

export default ReportResponseDetails
