import { Icon, Tooltip } from '@mui/material'
import { objectEntriesUnsafe } from 'core/helper'
import { useAcceptedDistributionQuery } from 'core/queryhooks/statsQueryHooks'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { useMemoFn } from '../../../alexlibs/react-hooks-lib'
import { acceptedDetails } from '../../../core/client/event/Event'
import { ReportAcceptedDistribution } from '../../../core/client/stats/statsTypes'
import { useI18n } from '../../../core/i18n'
import { HorizontalBarChart } from '../../../shared/Chart/HorizontalBarChart'
import { CompanyStatsPanelTitle } from './CompanyStatsPanelTitle'

export const AcceptedDistribution = ({ companyId }: { companyId: string }) => {
  const { m } = useI18n()
  const _query = useAcceptedDistributionQuery(companyId)

  function getIndex(a: any) {
    const index = acceptedDetails.indexOf(a)
    return index === -1 ? Number.MAX_SAFE_INTEGER : index
  }

  function sortAccepted(_: ReportAcceptedDistribution) {
    return objectEntriesUnsafe(_).sort((a, b) => {
      return getIndex(a[0]) - getIndex(b[0])
    })
  }

  const distribution = useMemoFn(_query.data, (_) =>
    sortAccepted(_).map(([acceptedDetailsLabel, nb]) => ({
      label: (
        <span className="text-sm">
          {m.responseDetailsShort[acceptedDetailsLabel]}
          <Tooltip title={m.responseDetails[acceptedDetailsLabel]}>
            <Icon
              fontSize="small"
              className="text-gray-500"
              sx={{
                verticalAlign: 'middle',
                ml: 1,
              }}
            >
              help_outline
            </Icon>
          </Tooltip>
        </span>
      ),
      value: nb,
    })),
  )

  return (
    <CleanInvisiblePanel loading={_query.isLoading}>
      <CompanyStatsPanelTitle>
        Types de promesse d'action faites par le professionnel
      </CompanyStatsPanelTitle>
      <p className="text-gray-500 mb-2">
        Quand le pro reconnaît qu'un signalement est fondé, il doit choisir une
        action parmi plusieurs options pour résoudre le problème.
      </p>
      <>
        <HorizontalBarChart data={distribution} />
      </>
    </CleanInvisiblePanel>
  )
}
