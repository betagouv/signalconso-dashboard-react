import * as React from 'react'
import {useI18n} from '../../../core/i18n'
import {Skeleton} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '../../../shared/Panel'
import {HorizontalBarChart} from '../../../shared/Chart/HorizontalBarChart'
import {useMemoFn} from '../../../alexlibs/react-hooks-lib'
import {Txt} from '../../../alexlibs/mui-extension'
import {ReviewLabel} from './ReviewLabel'
import {ScOption} from 'core/helper/ScOption'
import {useGetResponseReviewsQuery} from '../../../core/queryhooks/statsQueryHooks'

interface Props {
  companyId: string
}

export const ReviewDistribution = ({companyId}: Props) => {
  const {m} = useI18n()
  const _responseReviews = useGetResponseReviewsQuery(companyId)

  const reviewDistribution = useMemoFn(_responseReviews.data, _ =>
    _.positive > 0 || _.negative > 0 || _.neutral > 0
      ? [
          {
            label: (
              <ReviewLabel tooltip={m.positive} aria-label="happy">
                😀
              </ReviewLabel>
            ),
            value: _.positive,
            color: '#4caf50',
          },
          {
            label: (
              <ReviewLabel tooltip={m.neutral} aria-label="neutral">
                😐
              </ReviewLabel>
            ),
            value: _.neutral,
            color: '#f57c00',
          },
          {
            label: (
              <ReviewLabel tooltip={m.neutral} aria-label="sad">
                🙁
              </ReviewLabel>
            ),
            value: _.negative,
            color: '#d32f2f',
          },
        ]
      : [],
  )

  return (
    <Panel>
      <PanelHead>{m.consumerReviews}</PanelHead>
      {ScOption.from(_responseReviews.data)
        .map(_ => (
          <PanelBody>
            <Txt color="hint" block sx={{mb: 3}}>
              {m.consumerReviewsDesc}
            </Txt>
            <HorizontalBarChart width={80} data={reviewDistribution} grid />
          </PanelBody>
        ))
        .getOrElse(
          <PanelBody>
            <Skeleton height={66} width="100%" />
          </PanelBody>,
        )}
    </Panel>
  )
}
