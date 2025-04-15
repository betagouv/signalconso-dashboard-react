import { Page, PageTitle } from 'shared/Page'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'
import { ProCompaniesSelection } from './usersProMassManage/ProCompaniesSelection'

export function AccessesManagementPro() {
  return (
    <Page>
      <PageTitle>Gestion des accès</PageTitle>
      <p className="mb-8">
        Cette page vous permet d'ajouter, supprimer, ou modifier les accès de{' '}
        <b>un ou plusieurs utilisateurs</b> à{' '}
        <b>une ou plusieurs entreprises</b>, en quelques clics.
      </p>

      <div className="space-y-2">
        <h2 className="font-bold text-2xl">Que voulez-vous faire ?</h2>
        <div className="flex gap-2">
          <CleanDiscreetPanel>Retirer des accès</CleanDiscreetPanel>
          <CleanDiscreetPanel>Ajouter ou modifier des accès</CleanDiscreetPanel>
        </div>
        <h2 className="font-bold text-2xl">
          Sélectionner une ou plusieurs entreprises
        </h2>

        <ProCompaniesSelection />
        <h2 className="font-bold text-2xl">
          Sélectionner un ou plusieurs utilisateurs
        </h2>
      </div>
    </Page>
  )
}
