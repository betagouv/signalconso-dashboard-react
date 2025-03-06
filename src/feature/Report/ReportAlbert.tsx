import { Icon } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Btn } from '../../alexlibs/mui-extension'
import { useApiContext } from '../../core/context/ApiContext'
import { Id } from '../../core/model'
import { CleanDiscreetPanel } from '../../shared/Panel/simplePanels'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import React, { useEffect } from 'react'
import DescriptionRow from './DescriptionRow'
import { WithInlineIcon } from '../../shared/WithInlineIcon'
import { initTally } from '../../core/plugins/Tally'
import BetaTag from '../../shared/BetaTag'
import {
  AccessEventActions,
  AnalyticActionName,
  EventCategories,
  OutilsIaActions,
  trackEvent,
} from '../../core/plugins/Matomo'

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

  useEffect(() => {
    initTally()
  }, [])

  return (
    <CleanDiscreetPanel>
      <div className={'flex flex-col'}>
        <div className={'flex flex-row gap-2 mb-2 items-center'}>
          <WithInlineIcon icon="bubble_chart">
            Résumé du signalement
          </WithInlineIcon>
          <BetaTag />
        </div>
        {_getAlbert.data && (
          <>
            <div className="flex flex-col mb-4">
              {_getAlbert.data?.category === 'Incompréhensible' ? (
                <div>
                  <DescriptionRow
                    label={'Signalement incompréhensible'}
                    value={
                      'Le signalement est incohérent, illisible ou trop court pour être résumé.'
                    }
                  />
                </div>
              ) : (
                <span className="flex flex-col w-full">
                  {_getAlbert.data.summary}
                </span>
              )}
              <span className="font-light text-sm italic">
                Cette analyse a été réalisée par une IA à partir du texte du
                signalement.&nbsp;
              </span>
              {connectedUser.isSuperAdmin && (
                <div>
                  <span className="min-w-[10%] font-bold">
                    {getCodeConsoLabel()}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
        {_getAlbert.data ? (
          <div className="flex flex-col w-full">
            <Btn
              variant="outlined"
              size={'small'}
              data-tally-open="wo56xx"
              data-tally-emoji-text="👋"
              data-tally-emoji-animation="wave"
            >
              Donner Mon avis
              <Icon sx={{ ml: 1 }}>feedback</Icon>
            </Btn>
          </div>
        ) : (
          <Btn
            loading={_classify.isPending}
            onClick={() => {
              trackEvent(
                connectedUser,
                EventCategories.OutilsIa,
                OutilsIaActions.resumeSignalement,
                AnalyticActionName.click,
              )
              _classify.mutate(id)
            }}
          >
            Générer un résumé
          </Btn>
        )}
      </div>
    </CleanDiscreetPanel>
  )
}
