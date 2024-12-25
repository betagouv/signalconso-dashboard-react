import { UseQueryResult } from '@tanstack/react-query'
import { ApiError } from 'core/client/ApiClient'
import { ReportResponseReviews } from 'core/model'
import {
  useGetEngagementReviewsQuery,
  useGetResponseReviewsQuery,
} from 'core/queryhooks/statsQueryHooks'
import { ScPieChart } from 'shared/Chart/ScPieChart'
import { chartColors } from 'shared/Chart/chartsColors'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { Txt } from '../../../alexlibs/mui-extension'
import { useMemoFn } from '../../../alexlibs/react-hooks-lib'

interface Props {
  companyId: string
}

export function ResponseReviewsDistribution({ companyId }: Props) {
  const queryResult = useGetResponseReviewsQuery(companyId)
  return (
    <ReviewDistribution
      {...{ companyId, queryResult }}
      title="Avis initial des consommateurs"
      titleDesc="Avis des consommateurs sur la réponse apportée par le professionnel."
    />
  )
}

export function EngagementReviewsDistribution({ companyId }: Props) {
  const queryResult = useGetEngagementReviewsQuery(companyId)
  return (
    <ReviewDistribution
      {...{ companyId, queryResult }}
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
  const data = useMemoFn(queryResult.data, (_) =>
    _.positive > 0 || _.negative > 0 || _.neutral > 0
      ? [
          {
            label: 'Satisfait',
            value: _.positive,
            color: chartColors.darkgreen,
          },
          {
            label: 'Neutre',
            value: _.neutral,
            color: chartColors.darkgray,
          },
          {
            label: 'Insatisfait',
            value: _.negative,
            color: chartColors.darkred,
          },
        ]
      : [],
  )
  return (
    <CleanInvisiblePanel>
      <h2 className="font-bold text-2xl">{title}</h2>
      <Txt color="hint" block className="mb-2">
        {titleDesc}
      </Txt>
      <ScPieChart data={data} />
    </CleanInvisiblePanel>
  )
}
