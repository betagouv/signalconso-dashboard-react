import * as React from 'react'
import {useEffect} from 'react'
import {useI18n} from '../../../core/i18n'
import {Skeleton} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '../../../shared/Panel'
import {HorizontalBarChart} from '../../../shared/HorizontalBarChart/HorizontalBarChart'
import {ReportStatus, ReportStatusPro} from '@signal-conso/signalconso-api-sdk-js'
import {useCompanyStats} from '../useCompanyStats'
import {useEffectFn} from '../../../alexlibs/react-hooks-lib'
import {fromNullable} from 'fp-ts/es6/Option'
import {Txt} from '../../../alexlibs/mui-extension'
import {useToast} from '../../../core/toast'
import {ReviewLabel} from './ReviewLabel'
import {useMemoFn} from '../../../alexlibs/react-hooks-lib'

interface Props {
  companyId: string
}

export const ReviewDistribution = <T extends ReportStatus | ReportStatusPro>({companyId}: Props) => {
  const {m} = useI18n()
  const _stats = useCompanyStats(companyId)
  const {toastError} = useToast()
  useEffect(() => {
    _stats.responseReviews.fetch()
  }, [companyId])

  useEffectFn(_stats.responseReviews.error, toastError)

  const reviewDistribution = useMemoFn(_stats.responseReviews.entity, _ =>
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
      {fromNullable(_stats.responseReviews.entity)
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
