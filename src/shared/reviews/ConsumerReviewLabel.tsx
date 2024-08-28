import { Box, BoxProps, Icon } from '@mui/material'
import React from 'react'
import { ResponseEvaluation } from '../../core/client/event/Event'
import { fnSwitch } from '../../core/helper'
import { useI18n } from '../../core/i18n'

interface ConsumerReviewLabelProps extends BoxProps {
  evaluation: ResponseEvaluation
  displayLabel?: boolean
  center?: boolean
}

export const ConsumerReviewLabel = React.forwardRef(
  (
    { evaluation, displayLabel, center, ...other }: ConsumerReviewLabelProps,
    ref: any,
  ) => {
    const { m } = useI18n()
    const gap = '0.3rem'
    const alignItems = 'center'

    const sxProps = center
      ? {
          display: 'inline-flex',
          alignItems,
          width: '100%',
          justifyContent: 'center',
          gap,
        }
      : { display: 'inline-flex', alignItems, gap }
    return (
      <Box sx={sxProps} ref={ref} {...other}>
        {fnSwitch(evaluation, {
          [ResponseEvaluation.Positive]: (_) => (
            <Icon sx={{ color: (t) => t.palette.success.light }}>
              sentiment_very_satisfied
            </Icon>
          ),
          [ResponseEvaluation.Neutral]: (_) => (
            <Icon sx={{ color: (t) => t.palette.info.light }}>
              sentiment_neutral
            </Icon>
          ),
          [ResponseEvaluation.Negative]: (_) => (
            <Icon sx={{ color: (t) => t.palette.error.light }}>
              sentiment_very_dissatisfied
            </Icon>
          ),
        })}

        {displayLabel && m.responseEvaluationShort[evaluation]}
      </Box>
    )
  },
)
