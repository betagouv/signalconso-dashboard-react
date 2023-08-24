import {useI18n} from '../core/i18n'
import {ResponseEvaluation} from '../core/client/event/Event'
import {Box, BoxProps, Icon} from '@mui/material'
import {fnSwitch} from '../core/helper'
import React from 'react'

interface ConsumerReviewLabelProps extends BoxProps {
  evaluation: ResponseEvaluation
  displayLabel?: boolean
  center?: boolean
}

export const ConsumerReviewLabel = React.forwardRef(
  ({evaluation, displayLabel, center, ...other}: ConsumerReviewLabelProps, ref: any) => {
    const {m} = useI18n()
    const sxProps = center
      ? {
          display: 'inline-flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'center',
        }
      : {display: 'inline-flex', alignItems: 'center'}
    return (
      <Box sx={sxProps} ref={ref} {...other}>
        {fnSwitch(evaluation, {
          [ResponseEvaluation.Positive]: _ => (
            <Icon sx={{color: t => t.palette.success.light, marginRight: 1}}>sentiment_very_satisfied</Icon>
          ),
          [ResponseEvaluation.Neutral]: _ => (
            <Icon sx={{color: t => t.palette.info.light, marginRight: 1}}>sentiment_neutral</Icon>
          ),
          [ResponseEvaluation.Negative]: _ => (
            <Icon sx={{color: t => t.palette.error.light, marginRight: 1}}>sentiment_very_dissatisfied</Icon>
          ),
        })}

        {displayLabel && m.responseEvaluationShort[evaluation]}
      </Box>
    )
  },
)
