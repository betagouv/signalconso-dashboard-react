import { useMutation } from '@tanstack/react-query'
import { ReactElement } from 'react'
import { Fender, Modal, Txt } from '../../alexlibs/mui-extension'
import { Company, CompanySearchResult } from '../../core/client/company/Company'
import {
  ExtractionResult,
  SiretExtraction as ISiretExtraction,
} from '../../core/client/siret-extractor/SiretExtraction'
import {
  WebsiteUpdateCompany,
  WebsiteWithCompany,
} from '../../core/client/website/Website'
import { useApiContext } from '../../core/context/ApiContext'
import { useToast } from '../../core/context/toast/toastContext'
import { useI18n } from '../../core/i18n'
import { Id } from '../../core/model'
import { ScButton } from '../../shared/Button'

interface SiretExtractionProps {
  websiteWithCompany: WebsiteWithCompany
  siretExtraction?: ExtractionResult
  isLoading: boolean
  remove: () => Promise<any>
  identify: () => Promise<any>
  children: ReactElement<any>
}

export const SiretExtraction = ({
  websiteWithCompany,
  siretExtraction,
  isLoading,
  remove,
  identify,
  children,
}: SiretExtractionProps) => {
  const { api } = useApiContext()
  const { m } = useI18n()
  const { toastError, toastSuccess } = useToast()

  const _updateCompany = useMutation({
    mutationFn: (params: { id: Id; website: WebsiteUpdateCompany }) =>
      api.secured.website.updateCompany(params.id, params.website),
    onSuccess: () => identify().then((_) => toastSuccess(m.websiteEdited)),
  })

  const website = websiteWithCompany.host

  const associateAndIdentify = (company: CompanySearchResult) => {
    return _updateCompany.mutateAsync({
      id: websiteWithCompany.id,
      website: {
        siret: company.siret,
        name: company.name,
        address: company.address,
        activityCode: company.activityCode,
        isHeadOffice: company.isHeadOffice,
        isOpen: company.isOpen,
        isPublic: company.isPublic,
      },
    })
  }

  const matchingAssociatedCompanyBlock = (
    extraction: ISiretExtraction,
    associatedCompany?: Company,
  ) => {
    if (associatedCompany) {
      if (associatedCompany.siret === extraction.sirene?.siret) {
        return (
          <h3 className="text-green-600 text-xl">
            Cette entreprise correspond à celle renseignée par le consommateur
          </h3>
        )
      } else {
        return (
          <h3 className="text-red-600 text-xl">
            Cette entreprise ne correspond pas à celle renseignée par le
            consommateur
          </h3>
        )
      }
    } else {
      return null
    }
  }
  const infosSireneBlock = (extraction: ISiretExtraction) => {
    const isOpen = extraction.sirene?.isOpen ? (
      <span className="font-bold text-green-600">active</span>
    ) : (
      <span className="font-bold text-red-600">inactive</span>
    )

    if (extraction.sirene) {
      return (
        <div className="mb-4">
          <h3 className="text-green-600 text-xl">Infos Sirene</h3>
          <p>
            Entreprise {isOpen} immatriculée sous le nom{' '}
            <span className="font-bold">{extraction.sirene.name}</span>
          </p>
        </div>
      )
    } else if (extraction.siren?.valid || extraction.siret?.valid) {
      return (
        <h3 className="mb-4 text-red-600 text-xl">
          Aucune info trouvée dans la base Sirene
        </h3>
      )
    } else {
      return null
    }
  }

  const formatSiren = (siren: string) => {
    const part1 = siren.substring(0, 3)
    const part2 = siren.substring(3, 6)
    const part3 = siren.substring(6, 9)

    return `${part1} ${part2} ${part3}`
  }

  const formatSiret = (siret: string) => {
    const part4 = siret.substring(9)
    return `${formatSiren(siret)} ${part4}`
  }

  const siretBlock = (extraction: ISiretExtraction) => {
    const valid = extraction.siret?.valid ? (
      <div className="font-bold text-green-600">N° Siret valide</div>
    ) : (
      <div className="font-bold text-red-600">N° Siret invalide</div>
    )

    return (
      extraction.siret && (
        <div className="flex flex-row justify-between mb-6 items-center">
          <h2>{formatSiret(extraction.siret.siret)}</h2>
          {valid}
        </div>
      )
    )
  }

  const sirenBlock = (extraction: ISiretExtraction) => {
    const valid = extraction.siren?.valid ? (
      <div className="font-bold text-green-600">N° Siren valide</div>
    ) : (
      <div className="font-bold text-red-600">N° Siren invalide</div>
    )

    return (
      extraction.siren && (
        <div className="flex flex-row justify-between mb-6 items-center">
          <h2>{formatSiren(extraction.siren.siren)}</h2>
          {valid}
        </div>
      )
    )
  }

  const successBlock = (extraction: ISiretExtraction, close: () => void) => {
    return (
      <div className="flex flex-col mb-4 p-4 rounded-xl border shadow-xl">
        {siretBlock(extraction)}
        {sirenBlock(extraction)}
        {infosSireneBlock(extraction)}
        <h3 className="text-xl">Pages où le numéro a été trouvé</h3>
        <ul className="list-disc list-inside mb-4">
          {extraction.links.slice(0, 3).map((link) => (
            <li className="max-w-md truncate">
              <a
                className="text-blue-600 underline hover:no-underline"
                href={link}
                target="_blank"
                rel="noreferrer"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        {matchingAssociatedCompanyBlock(extraction, websiteWithCompany.company)}
        <div className="flex flex-row-reverse">
          {extraction.sirene?.isOpen && (
            <ScButton
              color="primary"
              onClick={() =>
                associateAndIdentify(extraction.sirene!).then((_) => close())
              }
            >
              Associer & Identifier
            </ScButton>
          )}
        </div>
      </div>
    )
  }

  const displayResults = (result: ExtractionResult, close: () => void) => {
    if (result.status === 'success') {
      if (result.extractions?.length !== 0) {
        return (
          <>
            {result.extractions?.map((extraction) =>
              successBlock(extraction, close),
            )}
          </>
        )
      } else {
        return (
          <Fender
            icon="sentiment_very_dissatisfied"
            title="Aucun Siret ou Siren n'a été trouvé"
            description={
              <>
                <Txt color="hint" size="big" block gutterBottom>
                  Le site web dispose peut-être d'une protection anti robot.
                  Essayez une recherche manuelle sur le site pour essayer de le
                  trouver.
                </Txt>
              </>
            }
          />
        )
      }
    } else if (result.error === 'NOT_FOUND') {
      return (
        <Fender
          icon="question_mark"
          title="Site web introuvable"
          description={
            <>
              <Txt color="hint" size="big" block gutterBottom sx={{ mb: 2 }}>
                Impossible de se connecter au site : il n'existe pas ou plus.
              </Txt>
              <ScButton
                variant="contained"
                onClick={() => remove().then((_) => close())}
              >
                Supprimer le site
              </ScButton>
            </>
          }
        />
      )
    } else if (result.error === 'ANTIBOT') {
      return (
        <Fender
          icon="exclamation_mark"
          title="Site web protégé"
          description={
            <>
              <Txt color="hint" size="big" block gutterBottom sx={{ mb: 2 }}>
                Le site web possède une protection anti robot. Essayez une
                recherche manuelle sur le site.
              </Txt>
            </>
          }
        />
      )
    } else {
      return (
        <Fender
          icon="cancel"
          title="Une erreur est survenue"
          description={
            <>
              <Txt color="hint" size="big" block gutterBottom>
                L'outil d'extraction a rencontré un problème, essayez une
                recherche manuelle sur le site.
              </Txt>
            </>
          }
        />
      )
    }
  }

  return (
    <Modal
      cancelLabel={m.close}
      PaperProps={{ style: { overflow: 'visible', maxHeight: '800px' } }}
      maxWidth="sm"
      fullWidth
      title={`Recherche du Siret sur ${website}`}
      loading={isLoading}
      content={(close) =>
        siretExtraction && displayResults(siretExtraction, close)
      }
    >
      {children}
    </Modal>
  )
}
