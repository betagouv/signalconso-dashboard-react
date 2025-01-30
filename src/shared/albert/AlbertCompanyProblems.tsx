import { Button, Icon, LinearProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { AlbertProblemsResult } from 'core/client/albert/AlbertProblemsResult'
import { useApiContext } from 'core/context/ApiContext'
import { useConnectedContext } from 'core/context/ConnectedContext'
import {
  AnalyticActionName,
  EventCategories,
  OutilsIaActions,
  trackEvent,
} from 'core/plugins/Matomo'
import { CompanyStatsPanelTitle } from 'feature/Company/stats/CompanyStatsPanelTitle'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'
import React from 'react'

export function AlbertCompanyProblems({ companyId }: { companyId: string }) {
  const { connectedUser } = useConnectedContext()
  const { api } = useApiContext()

  const query = useQuery({
    queryKey: ['getProblemsSeenByAlbert', companyId],
    queryFn: () => api.secured.company.getProblemsSeenByAlbert(companyId),
    enabled: false,
  })
  if (connectedUser.isNotPro) {
    return (
      <CleanInvisiblePanel>
        <div>
          <CompanyStatsPanelTitle>
            <span className={'inline-flex items-center gap-1 '}>
              <span>Problèmes fréquents</span>
              <span className="font-bold text-sm px-1 text-white bg-emerald-700 ">
                bêta
              </span>
            </span>
          </CompanyStatsPanelTitle>

          {!query.data && !query.isFetching && (
            <Button
              className="!mt-2"
              variant="outlined"
              size="small"
              onClick={() => {
                trackEvent(
                  connectedUser,
                  EventCategories.OutilsIa,
                  OutilsIaActions.analyseProblemesEntreprise,
                  AnalyticActionName.click,
                  companyId,
                )
                query.refetch()
              }}
              startIcon={<Icon>bubble_chart</Icon>}
            >
              Lancer l'analyse
            </Button>
          )}

          {query.isFetching && (
            <div className="py-2">
              <LinearProgress />
            </div>
          )}
          {query.data === null && (
            <p>
              Notre IA a échoué à produire un résultat utilisable. Vous pouvez
              essayer de la relancer.
            </p>
          )}
          {query.data && <DataDisplay result={query.data} />}
        </div>
      </CleanInvisiblePanel>
    )
  }
  return null
}

function DataDisplay({ result }: { result: AlbertProblemsResult }) {
  const { problemsFound, nbReportsUsed } = result
  const problems2 = problemsFound
    .map(({ probleme, signalements }) => ({
      probleme,
      percentage: Math.round((signalements / nbReportsUsed) * 100),
    }))

    .sort((a, b) => b.percentage - a.percentage)
  const arePercentagesMeaningful = nbReportsUsed >= 3
  return (
    <div className="py-2">
      <ul>
        {problems2.map(({ probleme, percentage }, idx) => {
          return (
            <li
              key={probleme}
              className="flex gap-1 items-start"
              style={
                arePercentagesMeaningful
                  ? { fontSize: pickFontSize(percentage) }
                  : {}
              }
            >
              <Icon fontSize="small" className="text-black mt-[4px]">
                arrow_right_alt
              </Icon>
              <span className="">
                {arePercentagesMeaningful && (
                  <span className="text-sm text-gray-500">
                    {percentage}% {idx === 0 ? 'des signalements' : ''}{' '}
                  </span>
                )}
                <span className="font-serif italic">{probleme}</span>
              </span>
            </li>
          )
        })}
      </ul>
      <p className="text-sm text-gray-500 mb-4">
        Analyse basée sur un sous-ensemble de {nbReportsUsed} signalements
        récents
      </p>
      <div className={'flex justify-stretch '}>
        <Button
          variant="outlined"
          className={'w-full'}
          size={'small'}
          data-tally-open="wo56xx"
          data-tally-emoji-text="👋"
          data-tally-emoji-animation="wave"
          endIcon={<Icon>feedback</Icon>}
        >
          Donner Mon avis
        </Button>
      </div>
    </div>
  )
}

function pickFontSize(percentage: number) {
  const normalized = percentage / 100
  const tweaked = Math.pow(normalized, 1.7) * 0.5
  return `${100 + Math.round(tweaked * 100)}%`
}
