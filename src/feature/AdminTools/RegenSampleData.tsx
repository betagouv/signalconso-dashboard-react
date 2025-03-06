import { Icon } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { config } from 'conf/config'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { ScButton } from '../../shared/Button'
import { CleanWidePanel } from '../../shared/Panel/simplePanels'

export const RegenSampleData = () => {
  const { api: api } = useConnectedContext()

  const _regen = useMutation({
    mutationFn: () => api.secured.admin.regenSampleData(),
  })

  if (config.isDev || config.isDemo) {
    return (
      <CleanWidePanel>
        <h2 className="font-bold text-lg mb-2">
          Regénération des données de démo
        </h2>
        <p className="mb-2">
          Cela relance la suppression puis génération des données de démo (celle
          qui est aussi refaite toutes les nuits). Les données générées sont un
          peu randomisées, vous aurez donc des résultats légèrement différents à
          chaque fois.
        </p>
        <p className="mb-4">
          Le code côté API peut être facilement modifié, si besoin d'ajouter des
          cas d'exemples qui vous intéressent.
        </p>
        <div className="flex justify-center">
          <ScButton
            variant="contained"
            startIcon={<Icon>auto_mode</Icon>}
            type="submit"
            disabled={_regen.isPending}
            loading={_regen.isPending}
            onClick={() => {
              _regen.mutate()
            }}
          >
            Regénérer
          </ScButton>
        </div>
      </CleanWidePanel>
    )
  }
  return null
}
