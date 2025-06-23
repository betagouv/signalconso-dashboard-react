import { ReportSearchResult } from 'core/model'
import { Page } from 'shared/Page'
import { ReportProLoaded } from './ReportPro'

export function ReportViewAsPro({
  reportSearchResult,
  onBackToStandardView,
}: {
  reportSearchResult: ReportSearchResult
  onBackToStandardView: () => void
}) {
  return (
    <Page>
      <div className="flex justify-center">
        <div className="bg-yellow-200 p-5  max-w-full">
          <p className="mb-2">
            Ceci est un aperçu de la page de signalement telle qu’elle apparaît
            pour le professionnel.
          </p>
          <p className="mb-2">
            Bien qu’il puisse y avoir quelques incohérences (car vous êtes
            actuellement connecté avec votre propre compte), cela donne une
            bonne idée de ce que le professionnel voit.
          </p>
          <p>
            Pour une vue parfaitement fidèle, il est nécessaire de trouver un
            utilisateur lié à cette entreprise et d’utiliser l’option "
            <i>Se connecter en tant que</i>".
          </p>
          <div className="flex justify-end mt-3">
            <button
              className="underline text-scbluefrance"
              onClick={onBackToStandardView}
            >
              Revenir à la vue normale
            </button>
          </div>
        </div>
      </div>
      <ReportProLoaded reportExtra={reportSearchResult} />
    </Page>
  )
}
