import {Skeleton} from '@mui/material'
import {ScOption} from 'core/helper/ScOption'
import {CleanDiscreetPanel} from 'shared/Panel/simplePanels'
import {Txt} from '../../../alexlibs/mui-extension'
import {useMemoFn} from '../../../alexlibs/react-hooks-lib'
import {useI18n} from '../../../core/i18n'
import {useGetEngagementReviewsQuery} from '../../../core/queryhooks/statsQueryHooks'
import {HorizontalBarChart} from '../../../shared/Chart/HorizontalBarChart'
import {ReviewLabel} from './ReviewLabel'

interface Props {
  companyId: string
}

export const EngagementReviewDistribution = ({companyId}: Props) => {
  const {m} = useI18n()
  const _engagementReviews = useGetEngagementReviewsQuery(companyId)

  const reviewDistribution = useMemoFn(_engagementReviews.data, _ =>
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
      <h2 className="font-bold text-lg">Avis ultérieur des consommateurs</h2>
      {ScOption.from(_engagementReviews.data)
        .map(_ => (
          <>
            <Txt color="hint" block sx={{mb: 3}}>
              Avis des consommateurs sur la réalisation des engagements du professionnel.
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
