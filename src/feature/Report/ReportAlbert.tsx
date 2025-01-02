import { Icon } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Btn } from '../../alexlibs/mui-extension'
import { useApiContext } from '../../core/context/ApiContext'
import { Id } from '../../core/model'
import { CleanDiscreetPanel } from '../../shared/Panel/simplePanels'

export const ReportAlbert = ({ id }: { id: Id }) => {
  const { api } = useApiContext()
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
    <span className="font-bold text-base px-1 text-desert-700 bg-desert-200">
      <Icon fontSize="small" className=" mb-[-5px] mr-1">
        bubble_chart
      </Icon>
      IA
    </span>
  )

  return (
    <CleanDiscreetPanel>
      {_getAlbert.data && (
        <>
          <div className="flex items-start justify-between">
            <div className="text-xl">
              Classification par Albert : <Category />
            </div>
            <div className="flex gap-2">
              <div>Indice de confiance : {_getAlbert.data.confidenceScore}</div>
              {iaMarker}
            </div>
          </div>
          <div className="text-sm italic">{_getAlbert.data?.explanation}</div>
          <h2 className="text-xl mt-8">Résumé :</h2>
          <div className="mb-8">{_getAlbert.data.summary}</div>
          <CodeConsoCategory />
          <div className="mb-2">{_getAlbert.data.codeConso}</div>
        </>
      )}
      <div className="flex justify-end items-center">
        <Btn loading={_classify.isPending} onClick={() => _classify.mutate(id)}>
          Lancer Albert
        </Btn>
        {!_getAlbert.data && iaMarker}
      </div>
    </CleanDiscreetPanel>
  )
}
