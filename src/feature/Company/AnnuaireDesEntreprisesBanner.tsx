import { useConnectedContext } from 'core/context/connected/connectedContext'

const ExternalLinkWithFavicon = ({
  href,
  text,
}: {
  href: string
  text: string
}) => {
  const url = new URL(href)
  const faviconUrl = `${url.protocol}//${url.hostname}/favicon.ico`

  return (
    <div className="flex items-center">
      <img src={faviconUrl} alt="Favicon" className="w-4 h-4 mr-2" />
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-scbluefrance hover:underline"
      >
        {text}
      </a>
    </div>
  )
}

export function AnnuaireDesEntreprisesBanner({
  companySiret,
}: {
  companySiret: string
}) {
  const { connectedUser } = useConnectedContext()

  if (connectedUser.isNotPro) {
    return (
      <div className="mb-1 ">
        <span className={'font-bold'}>Voir sur&nbsp;:</span>

        <div className="flex flex-col justify-end mb-1 ">
          <ExternalLinkWithFavicon
            text="Annuaire des Entreprises"
            href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${companySiret.trim()}`}
          />
          <ExternalLinkWithFavicon
            text="Pappers"
            href={`https://www.pappers.fr/recherche?q=${companySiret.trim()}`}
          />
        </div>
      </div>
    )
  }
  return null
}
