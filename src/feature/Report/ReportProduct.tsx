import { Icon, Tooltip } from '@mui/material'
import { ReactNode } from 'react'
import { CleanDiscreetPanel } from 'shared/Panel/simplePanels'
import { Id } from '../../core/model'
import { useGetBarcodeQuery } from '../../core/queryhooks/barcodeQueryHooks'
import { ReportBlockTitle } from '../../shared/ReportBlockTitle'

export const ReportProduct = ({
  barcodeProductId,
  rappelConsoId,
  variant,
}: {
  barcodeProductId?: Id
  rappelConsoId?: number
  variant: 'pro' | 'agent_or_admin'
}) => {
  const _getProductData = useGetBarcodeQuery(barcodeProductId!, {
    enabled: !!barcodeProductId,
  })
  if (!barcodeProductId && !rappelConsoId) {
    return null
  }
  const { data } = _getProductData
  const coreContent = (
    <div className="mt-2 space-y-2">
      {data && (
        <>
          <div>
            <Row
              label="Code-barres (GTIN)"
              value={
                <span>
                  <span className="font-mono">{data.gtin}</span>
                  {data.existOnGS1 ? null : (
                    <span>
                      {' '}
                      -{' '}
                      <Icon className="mb-[-3px]" fontSize="small">
                        warning
                      </Icon>{' '}
                      introuvable dans le référentiel de GS1
                    </span>
                  )}
                </span>
              }
            />
            <Row label="Nom du produit" value={data.productName ?? 'N/A'} />
            <Row label="Marque" value={data.brandName ?? 'N/A'} />
            <Row label="Conditionnement" value={data.packaging ?? 'N/A'} />
            <Row label="Codes tracabilité" value={data.emb_codes ?? 'N/A'} />
          </div>
          {data.existOnOpenFoodFacts && (
            <OpenFfLink gtin={data.gtin} kind="open_ff" />
          )}
          {data.existOnOpenBeautyFacts && (
            <OpenFfLink gtin={data.gtin} kind="open_bf" />
          )}
        </>
      )}
      {rappelConsoId && <RappelConsoLink {...{ rappelConsoId }} />}
    </div>
  )
  return variant === 'agent_or_admin' ? (
    <CleanDiscreetPanel>
      <ReportBlockTitle icon="shopping_cart">Fiche produit</ReportBlockTitle>
      {coreContent}
    </CleanDiscreetPanel>
  ) : (
    <div>
      À propos du produit :<div className="ml-4">{coreContent}</div>
    </div>
  )
}

const Row = ({ label, value }: { label: string; value: ReactNode }) => {
  return (
    <div className="flex w-full">
      <span className="min-w-[20%] font-bold">{label} :</span>
      <Tooltip title={value}>
        <span className="truncate text-gray-600"> {value}</span>
      </Tooltip>
    </div>
  )
}

function OpenFfLink({
  gtin,
  kind,
}: {
  gtin: string
  kind: 'open_ff' | 'open_bf'
}) {
  const domain =
    kind === 'open_ff' ? 'fr.openfoodfacts.org' : 'fr.openbeautyfacts.org'
  const siteName = kind === 'open_ff' ? 'Open Food Facts' : 'Open Beauty Facts'
  return (
    <a
      className="block text-sm"
      href={`https://${domain}/produit/${gtin}`}
      target="_blank"
      rel="noreferrer"
    >
      Voir sur {siteName}
    </a>
  )
}

function RappelConsoLink({ rappelConsoId }: { rappelConsoId: number }) {
  return (
    <div className="flex gap-2 w-fit">
      <Icon>warning_amber</Icon>
      <span>
        <strong>Produit rappelé</strong>{' '}
        <a
          href={`https://rappel.conso.gouv.fr/fiche-rappel/${rappelConsoId}/Interne`}
          className="text-sm"
          rel="noreferrer"
          target="_blank"
        >
          voir sa fiche sur RappelConso
        </a>
      </span>
    </div>
  )
}
