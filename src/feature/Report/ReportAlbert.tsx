import { Id } from '../../core/model'
import { Btn } from '../../alexlibs/mui-extension'
import { CleanDiscreetPanel } from '../../shared/Panel/simplePanels'
import React from 'react'
import { useApiContext } from '../../core/context/ApiContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

  return (
    <CleanDiscreetPanel>
      {_getAlbert.data && (
        <>
          <div className="flex items-start justify-between mb-2">
            <div className="text-xl">
              Classification par Albert : <Category />
            </div>
            <div>Indice de confiance : {_getAlbert.data.confidenceScore}</div>
          </div>
          <div className="text-sm italic">{_getAlbert.data?.explanation}</div>
          <div className="mt-4 mb-2">{_getAlbert.data.summary}</div>
          <div className="mt-4 mb-2">{_getAlbert.data.codeConso}</div>
        </>
      )}
      <div className="flex flex-row-reverse">
        <Btn loading={_classify.isPending} onClick={() => _classify.mutate(id)}>
          Lancer Albert
        </Btn>
      </div>
    </CleanDiscreetPanel>
  )
}
