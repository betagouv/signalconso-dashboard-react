import { Icon, Tooltip } from '@mui/material'
import { objectEntriesUnsafe } from 'core/helper'
import { useAcceptedDistributionQuery } from 'core/queryhooks/statsQueryHooks'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'
import { useMemoFn } from '../../../alexlibs/react-hooks-lib'
import { useI18n } from '../../../core/i18n'
import { HorizontalBarChart } from '../../../shared/Chart/HorizontalBarChart'
import { PanelBody } from '../../../shared/Panel'
import { acceptedDetails } from '../../../core/client/event/Event'

export const AcceptedDistribution = ({ companyId }: { companyId: string }) => {
  const { m } = useI18n()
  const _query = useAcceptedDistributionQuery(companyId)
  const distribution = useMemoFn(_query.data, (_) =>
    objectEntriesUnsafe(_)
      .sort(
        ([a, counta], [b, countb]) =>
          acceptedDetails.indexOf(a) - acceptedDetails.indexOf(b),
      )
      .map(([acceptedDetailsLabel, nb]) => ({
        label: (
          <span className="text-sm">
            {m.responseDetailsShort[acceptedDetailsLabel]}
            <Tooltip title={m.responseDetails[acceptedDetailsLabel]}>
              <Icon
                fontSize="small"
                sx={{
                  verticalAlign: 'middle',
                  color: (t) => t.palette.text.disabled,
                  ml: 1,
                }}
              >
                help
              </Icon>
            </Tooltip>
          </span>
        ),
        value: nb,
      })),
  )

  return (
    <CleanDiscreetPanel loading={_query.isLoading}>
      <h2 className="font-bold text-lg">
        Types de promesse d'action faites par le professionnel
      </h2>
      <p className="text-gray-500">
        Lorsque le pro accepte un signalement comme étant fondé, il doit choisir
        l'action qu'il promet de faire pour résoudre la situation, parmi
        plusieurs options possibles (par exemple "
        <span className="italic">
          Je vais procéder à un remboursement ou un avoir
        </span>
        ")
      </p>
      <PanelBody>
        <HorizontalBarChart data={distribution} grid />
      </PanelBody>
    </CleanDiscreetPanel>
  )
}
