import { Icon } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Btn, IconBtn } from '../../alexlibs/mui-extension'
import { useApiContext } from '../../core/context/ApiContext'
import { Id } from '../../core/model'
import { CleanDiscreetPanel } from '../../shared/Panel/simplePanels'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { ScDialog } from '../../shared/ScDialog'

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
        <span className="text-green-600 text-xl font-bold">
          {_getAlbert.data?.category}
        </span>
      )
    } else if (_getAlbert.data?.category === 'Injurieux') {
      return (
        <span className="text-red-600 text-xl font-bold">
          {_getAlbert.data?.category}
        </span>
      )
    } else {
      return (
        <span className="text-orange-600 text-xl font-bold">
          {_getAlbert.data?.category}
        </span>
      )
    }
  }

  const CodeConsoCategory = () => {
    if (_getAlbert.data?.codeConsoCategory === 'Oui') {
      return (
        <div className="text-green-600 text-xl">
          Ce signalement relève du code de la consommation
        </div>
      )
    } else if (_getAlbert.data?.codeConsoCategory === 'Non') {
      return (
        <div className="text-red-600 text-xl">
          Ce signalement ne relève pas du code de la consommation
        </div>
      )
    } else {
      const color = _getAlbert.data?.codeConsoCategory?.startsWith('Oui')
        ? 'text-green-600'
        : _getAlbert.data?.codeConsoCategory?.startsWith('Non')
          ? 'text-red-600'
          : 'text-yellow-600'

      return (
        <div className={`${color} text-xl`}>
          {_getAlbert.data?.codeConsoCategory}
        </div>
      )
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

  const ConfidenceScore = ({ score }: { score?: string }) => {
    const scoreAsNumber = Number(score)

    return isNaN(scoreAsNumber) ? (
      <></>
    ) : (
      <div className={'text-sm'}>
        ({Math.floor(scoreAsNumber * 100)} % de confiance)
      </div>
    )
  }

  const ClassificationHelp = () => {
    return (
      <ScDialog
        title={`Contenu produit par de l'IA`}
        content={(_) => (
          <>
            <p>Ce texte :</p>
            <p className="mb-2">
              a été produit par <b>une intelligence artificielle</b>.
            </p>
            <p className="mb-2">
              C'est une description sommaire de l'activité de cette entreprise,
              d'après ce que notre IA a pu comprendre en regardant ses derniers
              signalements.
            </p>
            <p>
              <b>L'IA fait des erreurs et des approximations.</b> Considérez ce
              contenu comme un outil pratique mais pas 100% fiable.
            </p>
          </>
        )}
      >
        <IconBtn size={'small'} icon={'help'}>
          ""
        </IconBtn>
      </ScDialog>
    )
  }

  return (
    <CleanDiscreetPanel>
      {_getAlbert.data && (
        <>
          <div className="flex items-center space-x-2">
            <div className="text-xl">{iaMarker} Analyse du signalement</div>
            <div className="flex items-center mt-1">
              {' '}
              {/* Adjust margin-top here */}
              <ConfidenceScore score={_getAlbert.data.confidenceScore} />
            </div>
          </div>
          {/*<div>*/}
          {/*  <div className="flex text-xl">*/}
          {/*    {iaMarker} Analyse*/}
          {/*    <ConfidenceScore score={_getAlbert.data.confidenceScore} />*/}
          {/*  </div>*/}
          {/*  /!*<div className="flex gap-2">*!/*/}
          {/*  /!*  <ConfidenceScore score={_getAlbert.data.confidenceScore} />*!/*/}
          {/*  /!*  {iaMarker}*!/*/}
          {/*  /!*</div>*!/*/}
          {/*</div>*/}
          <div className="italic mt-4">
            <Category /> : {_getAlbert.data?.explanation}
          </div>
          <h2 className="text-xl mt-8">Résumé :</h2>
          <div className="mb-8">{_getAlbert.data.summary}</div>
          {connectedUser.isSuperAdmin && <CodeConsoCategory />}
          <div className="mb-2">{_getAlbert.data.codeConso}</div>
        </>
      )}
      <div className="flex justify-end items-center">
        {_getAlbert.data ? (
          <></>
        ) : (
          <Btn
            loading={_classify.isPending}
            onClick={() => _classify.mutate(id)}
          >
            Lancer Albert
          </Btn>
        )}
        {!_getAlbert.data && iaMarker}
      </div>
    </CleanDiscreetPanel>
  )
}
