import React from 'react'
import {Box, Tooltip} from '@mui/material'
import {ProResponseLabel} from '../../shared/ProResponseLabel' // Assurez-vous que le chemin est correct
import {useI18n} from '../../core/i18n' // Assurez-vous que le chemin est correct
import {ReportResponse} from '../../core/model' // Assurez-vous que le chemin est correct
import {ScOption} from 'core/helper/ScOption' // Assurez-vous que le chemin est correct

type ReportResponseDetailsProps = {
  details: ReportResponse | {description: string} | null | undefined
}

const ReportResponseDetails: React.FC<ReportResponseDetailsProps> = ({details}) => {
  const {m} = useI18n()
  if (details && 'description' in details) {
    return <div>{details.description}</div> // Remplacez par votre logique de rendu appropriée
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
    .getOrElse(<></>) // Retourne un élément vide si `details` est null ou undefined
}

export default ReportResponseDetails
