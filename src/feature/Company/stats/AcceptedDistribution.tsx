import { Icon, Tooltip } from '@mui/material'
import { objectEntriesUnsafe } from 'core/helper'
import { useAcceptedDistributionQuery } from 'core/queryhooks/statsQueryHooks'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import { useMemoFn } from '../../../alexlibs/react-hooks-lib'
import { acceptedDetails } from '../../../core/client/event/Event'
import { ReportAcceptedDistribution } from '../../../core/client/stats/statsTypes'
import { useI18n } from '../../../core/i18n'
import { HorizontalBarChart } from '../../../shared/Chart/HorizontalBarChart'

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
      <h2 className="font-bold text-2xl">
        Types de promesse d'action faites par le professionnel
      </h2>
      <p className="text-gray-500 mb-2">
        Lorsque le pro accepte un signalement comme étant fondé, il doit choisir
        l'action qu'il promet de faire pour résoudre la situation, parmi
        plusieurs options possibles (par exemple "
        <span className="italic">
          Je vais procéder à un remboursement ou un avoir
        </span>
        ")
      </p>
      <>
        <HorizontalBarChart data={distribution} grid />
      </>
    </CleanInvisiblePanel>
  )
}
