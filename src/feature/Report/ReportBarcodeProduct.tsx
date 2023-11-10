import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {Id} from '../../core/model'
import {useApiContext} from '../../core/context/ApiContext'
import {useQuery} from '@tanstack/react-query'
import {WithInlineIcon} from '../../shared/WithInlineIcon'
import {Chip, Tooltip} from '@mui/material'

interface ReportBarcodeProductProps {
  barcodeProductId: Id
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

export const ReportBarcodeProduct = ({barcodeProductId}: ReportBarcodeProductProps) => {
  const {api} = useApiContext()
  const {data} = useQuery({
    queryKey: ['barcode', barcodeProductId],
    queryFn: () => api.secured.barcode.get(barcodeProductId),
  })

  return (
    <Panel>
      <PanelHead>
        <div className="flex justify-between">
          <WithInlineIcon icon="shopping_cart">Fiche produit</WithInlineIcon>
          <Chip label={`Code-barres (GTIN) : ${data?.gtin}`} />
        </div>
      </PanelHead>
      <PanelBody>
        <Row label="Nom du produit" value={data?.productName ?? 'N/A'} />
        <Row label="Marque" value={data?.brandName ?? 'N/A'} />
        <Row label="Conditionnement" value={data?.packaging ?? 'N/A'} />
        <Row label="Codes tracabilité" value={data?.emb_codes ?? 'N/A'} />
        <div className="mt-4 flex flex-row-reverse">
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
      </PanelBody>
    </Panel>
  )
}
