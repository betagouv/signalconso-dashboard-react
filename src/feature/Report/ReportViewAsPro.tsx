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
    <Page maxWidth="l">
      <div className="flex justify-center">
        <div className="bg-yellow-200 p-2 text-sm max-w-xl">
          <p className="mb-2">
            Ceci est la page du signalement tel que le voit le professionel, à
            peu près.
          </p>
          <p className="mb-2">
            Il y a peut-être quelques incohérences (car vous êtes quand même
            connecté avec votre propre compte), mais grosso-modo cela donne une
            idée de ce que voit le pro.
          </p>
          <p>
            Pour avoir une vue vraiment exacte, il faut trouver un utilisateur
            de cet entreprise, et utiliser le menu "
            <i>Se connecter en tant que</i>".
          </p>
          <div className="flex justify-end">
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
