import {Box, Tooltip} from '@mui/material'
import {useI18n} from 'core/i18n'
import {ConsumerReview} from 'core/model'
import {ConsumerReviewLabel} from 'shared/reviews/ConsumerReviewLabel'
import {ReportSearchResult} from '../../core/client/report/Report'

export function ConsumerReviewLabels({report, detailsTooltip}: {report: ReportSearchResult; detailsTooltip: boolean}) {
  const {consumerReview, engagementReview} = report
  const label1 = consumerReview ? <LabelWithTooltip withTooltip={detailsTooltip} review={consumerReview} /> : null
  const label2 = engagementReview ? <LabelWithTooltip withTooltip={detailsTooltip} review={engagementReview} /> : null
  if (label1 && label2) {
    return (
      <div className="flex items-center gap-1">
        {label1} puis {label2}
      </div>
    )
  }
  return label1 ?? label2 ?? null
}

function LabelWithTooltip({withTooltip, review}: {withTooltip: boolean; review: ConsumerReview}) {
  const {m} = useI18n()
  const label = <ConsumerReviewLabel evaluation={review.evaluation} />

  if (withTooltip) {
    return (
      <Tooltip
        title={
          <>
            <Box sx={{fontWeight: t => t.typography.fontWeightBold, fontSize: 'larger', mb: 1}}>
              {m.responseEvaluationShort[review.evaluation]}
            </Box>
            <Box
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 20,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {review.details}
            </Box>
          </>
        }
      >
        {label}
      </Tooltip>
    )
  }
  return label
}
