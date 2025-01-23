import { Icon, IconButton } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Btn, IconBtn } from '../../alexlibs/mui-extension'
import { useApiContext } from '../../core/context/ApiContext'
import { Id } from '../../core/model'
import { CleanDiscreetPanel } from '../../shared/Panel/simplePanels'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { ScDialog } from '../../shared/ScDialog'
import React, { useEffect } from 'react'
import { Description } from '@mui/icons-material'
import DescriptionRow from './DescriptionRow'
import { stopPropagation } from '../../core/helper'
import { config } from '../../conf/config'
import { WithInlineIcon } from '../../shared/WithInlineIcon'
import { initTally } from '../../core/plugins/Tally'
import { styleUtils } from '../../core/theme'

export const ReportAlbert = ({ id }: { id: Id }) => {
  const { api } = useApiContext()
  const { connectedUser, api: apiSdk } = useConnectedContext()
  const _getAlbert = useQuery({
    queryKey: [`albert_classification_report_${id}`],
    queryFn: () => api.secured.reports.getAlbertClassification(id),
  })

  const queryClient = useQueryClient()
  const _classify = useMutation({
    mutationFn: (id: Id) => api.secured.reports.classifyAndSummarize(id),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [`albert_classification_report_${id}`],
      })
    },
  })

  const Category = () => {
    if (_getAlbert.data?.category === 'Valide') {
      return (
        <span className="text-green-600  font-bold">
          {_getAlbert.data?.category}
        </span>
      )
    } else if (_getAlbert.data?.category === 'Injurieux') {
      return (
        <span className="text-red-600  font-bold">
          {_getAlbert.data?.category}
        </span>
      )
    } else {
      return (
        <span className="text-orange-600  font-bold">
          {_getAlbert.data?.category}
        </span>
      )
    }
  }

  const getCodeConsoLabel = () => {
    if (_getAlbert.data?.codeConsoCategory === 'Oui') {
      return 'Ce signalement relève du code de la consommation'
    } else {
      return 'Ce signalement ne relève pas du code de la consommation'
    }
  }

  const iaMarker = (
    <span className="font-bold text-base px-1 text-desert-700 bg-desert-200 rounded-lg">
      <Icon fontSize="small" className=" mb-[-5px] mr-1">
        bubble_chart
      </Icon>
      IA
    </span>
  )

  useEffect(() => {
    initTally()
  }, [])

  return (
    <CleanDiscreetPanel>
      <div className={'flex flex-col gap-2'}>
        <WithInlineIcon icon="bubble_chart">
          Analyse du signalement
        </WithInlineIcon>

        <span className="font-light italic p-4">
          Notre IA analyse les signalements pour en extraire un résumé et
          évaluer leur pertinence. Cela vous permet de prioriser les
          signalements importants et de gagner du temps.{' '}
          <b>
            Cette fonctionnalité est en phase d’expérimentation, vos retours
            nous aideront à l’améliorer.
          </b>
        </span>

        {_getAlbert.data && (
          <>
            <div className="flex flex-col gap-3 my-4">
              {_getAlbert.data?.category != 'Incompréhensible' && (
                <div>
                  <span className="text-base px-1 text-white bg-orange-500 rounded-lg">
                    Signalement incompréhensible
                  </span>
                </div>
              )}
              <DescriptionRow label="Résumé" value={_getAlbert.data.summary} />
              {connectedUser.isSuperAdmin && (
                <div>
                  <DescriptionRow
                    label={getCodeConsoLabel()}
                    value={_getAlbert.data.codeConso}
                  />
                </div>
              )}
            </div>
          </>
        )}
        {_getAlbert.data ? (
          <Btn
            variant="text"
            data-tally-open="wo56xx"
            data-tally-emoji-text="👋"
            data-tally-emoji-animation="wave"
          >
            Donner Mon avis
            <Icon sx={{ ml: 1 }}>feedback</Icon>
          </Btn>
        ) : (
          <Btn
            loading={_classify.isPending}
            onClick={() => _classify.mutate(id)}
          >
            {iaMarker}&nbsp; Lancer Albert
          </Btn>
        )}
      </div>
    </CleanDiscreetPanel>
  )
}
