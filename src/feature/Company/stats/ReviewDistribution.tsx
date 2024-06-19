import {Skeleton} from '@mui/material'
import {UseQueryResult} from '@tanstack/react-query'
import {ApiError} from 'core/client/ApiClient'
import {ScOption} from 'core/helper/ScOption'
import {ReportResponseReviews} from 'core/model'
import {useGetEngagementReviewsQuery, useGetResponseReviewsQuery} from 'core/queryhooks/statsQueryHooks'
import {CleanDiscreetPanel} from 'shared/Panel/simplePanels'
import {Txt} from '../../../alexlibs/mui-extension'
import {useMemoFn} from '../../../alexlibs/react-hooks-lib'
import {useI18n} from '../../../core/i18n'
import {HorizontalBarChart} from '../../../shared/Chart/HorizontalBarChart'
import {ReviewLabel} from './ReviewLabel'

interface Props {
  companyId: string
}

export function ResponseReviewsDistribution({companyId}: Props) {
  const queryResult = useGetResponseReviewsQuery(companyId)
  return (
    <ReviewDistribution
      {...{companyId, queryResult}}
      title="Avis initial des consommateurs"
      titleDesc="Avis des consommateurs sur la réponse apportée par le professionnel."
    />
  )
}

export function EngagementReviewsDistribution({companyId}: Props) {
  const queryResult = useGetEngagementReviewsQuery(companyId)
  return (
    <ReviewDistribution
      {...{companyId, queryResult}}
      title="Avis ultérieur des consommateurs"
      titleDesc="Avis des consommateurs sur la réalisation des engagements du professionnel."
    />
  )
}

function ReviewDistribution({
  queryResult,
  title,
  titleDesc,
}: {
  queryResult: UseQueryResult<ReportResponseReviews, ApiError>
  title: string
  titleDesc: string
}) {
  const {m} = useI18n()

  const reviewDistribution = useMemoFn(queryResult.data, _ =>
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
              <ReviewLabel tooltip={m.negative} aria-label="sad">
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
    <CleanDiscreetPanel>
      <h2 className="font-bold text-lg">{title}</h2>
      {ScOption.from(queryResult.data)
        .map(_ => (
          <>
            <Txt color="hint" block sx={{mb: 3}}>
              {titleDesc}
            </Txt>
            <HorizontalBarChart width={80} data={reviewDistribution} grid />
          </>
        ))
        .getOrElse(
          <>
            <Skeleton height={66} width="100%" />
          </>,
        )}
    </CleanDiscreetPanel>
  )
}
