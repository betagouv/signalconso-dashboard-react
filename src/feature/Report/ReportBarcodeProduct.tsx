import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {Id} from '../../core/model'
import {WithInlineIcon} from '../../shared/WithInlineIcon'
import {Chip, Icon, Tooltip} from '@mui/material'
import {useGetBarcodeQuery} from '../../core/queryhooks/barcodeQueryHooks'
import {CleanDiscreetPanel, CleanWidePanel} from 'shared/Panel/simplePanels'

interface ReportBarcodeProductProps {
  barcodeProductId?: Id
  rappelConsoId?: number
}

interface RowProps {
  label: string
  value: string
}

const Row = ({label, value}: RowProps) => {
  return (
    <div className="flex w-full">
      <span className="min-w-[20%] font-bold">{label} :</span>
      <Tooltip title={value}>
        <span className="truncate text-gray-600"> {value}</span>
      </Tooltip>
    </div>
  )
}

export const ReportBarcodeProduct = ({barcodeProductId, rappelConsoId}: ReportBarcodeProductProps) => {
  const {data} = useGetBarcodeQuery(barcodeProductId!, {enabled: !!barcodeProductId})

  if (barcodeProductId) {
    return (
      <CleanDiscreetPanel>
        <div className="flex justify-between">
          <WithInlineIcon icon="shopping_cart">Fiche produit</WithInlineIcon>
          <Chip label={`Code-barres (GTIN) : ${data?.gtin}`} />
        </div>
        <div>
          <Row label="Nom du produit" value={data?.productName ?? 'N/A'} />
          <Row label="Marque" value={data?.brandName ?? 'N/A'} />
          <Row label="Conditionnement" value={data?.packaging ?? 'N/A'} />
          <Row label="Codes tracabilité" value={data?.emb_codes ?? 'N/A'} />
          {rappelConsoId && (
            <div className="flex gap-2 text-lg bg-yellow-100 p-2 w-fit mt-4">
              <Icon>swap_horiz</Icon>
              <span>
                Produit rappelé{' '}
                <a href={`https://rappel.conso.gouv.fr/fiche-rappel/${rappelConsoId}/Interne`} target="_blank">
                  (Voir sur RappelConso)
                </a>
              </span>
            </div>
          )}
          <div className="mt-2 p-2">
            {data?.existOnOpenFoodFacts && (
              <a className="text-lg" href={`https://fr.openfoodfacts.org/produit/${data.gtin}`} target="_blank">
                Voir sur Open food facts
              </a>
            )}
            {data?.existOnOpenBeautyFacts && (
              <a className="text-lg" href={`https://fr.openbeautyfacts.org/produit/${data.gtin}`} target="_blank">
                Voir sur Open beauty facts
              </a>
            )}
          </div>
        </div>
      </CleanDiscreetPanel>
    )
  } else if (rappelConsoId) {
    return (
      <CleanDiscreetPanel>
        <div className="flex gap-2 text-lg bg-yellow-100 p-2">
          <Icon>swap_horiz</Icon>
          <span>
            Produit rappelé{' '}
            <a href={`https://rappel.conso.gouv.fr/fiche-rappel/${rappelConsoId}/Interne`} target="_blank">
              (Voir sur RappelConso)
            </a>
          </span>
        </div>
      </CleanDiscreetPanel>
    )
  } else {
    return null
  }
}
