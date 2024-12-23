import { Alert } from 'alexlibs/mui-extension'
import { useConnectedContext } from 'core/context/ConnectedContext'

export function AnnuaireDesEntreprisesBanner() {
  const { connectedUser } = useConnectedContext()
  if (connectedUser.isNotPro) {
    return (
      <Alert type="info">
        Connectez-vous sur{' '}
        <a
          href={'https://annuaire-entreprises.data.gouv.fr/lp/agent-public'}
          target="_blank"
          rel="noreferrer"
        >
          l'Annuaire des Entreprises
        </a>{' '}
        pour accéder aux informations protégées des entreprises (non
        diffusibles, statuts, actes, bilans financiers).
      </Alert>
    )
  }
  return null
}
