import {GS1Product} from '../../core/client/gs1/GS1Product'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {Id} from '../../core/model'
import {useApiContext} from '../../core/context/ApiContext'
import {useQuery} from '@tanstack/react-query'
import {WithInlineIcon} from '../../shared/WithInlineIcon'
import {Chip, Grid, Paper} from '@mui/material'

interface ReportGS1ProductProps {
  gs1ProductId: Id
}

interface RowProps {
  label: string
  value: string
}

const Row = ({label, value}: RowProps) => {
  return (
    <div className="flex w-1/2">
      <span className="min-w-[30%]">{label} :</span>
      <span> {value}</span>
    </div>
  )
}

export const ReportGS1Product = ({gs1ProductId}: ReportGS1ProductProps) => {
  const {api} = useApiContext()
  const {refetch, isLoading, isError, data, error} = useQuery({
    queryKey: ['gs1', gs1ProductId],
    queryFn: () => api.secured.gs1.get(gs1ProductId),
  })

  return (
    <Panel>
      <PanelHead>
        <div className="flex justify-between">
          <WithInlineIcon icon="shopping_cart">Fiche produit</WithInlineIcon>
          <Chip label={`GTIN: ${data?.gtin}`} />
        </div>
      </PanelHead>
      <PanelBody>
        <Row label="Descprtion" value={data?.productDescription ?? 'N/A'} />
        <Row label="Marque" value={data?.brandName ?? 'N/A'} />
        <Row label="Sous-marque" value={data?.subBrandName ?? 'N/A'} />
        <Grid sx={{mt: 2}} container spacing={2} alignItems="stretch">
          <Grid item xs={12} sm={6}>
            <Panel>
              <PanelHead>
                <WithInlineIcon icon="scale">Contenu</WithInlineIcon>
              </PanelHead>
              <PanelBody>
                <ul>
                  {data?.netContent?.map(netContent => (
                    <li>
                      {netContent.quantity} {netContent.unitCode}
                    </li>
                  ))}
                </ul>
              </PanelBody>
            </Panel>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Panel>
              <PanelHead>
                <WithInlineIcon icon="scale">Entreprise</WithInlineIcon>
              </PanelHead>
              <PanelBody>
                <div>Nom: {data?.companyName}</div>
                <div>Ville: {data?.postalAddress?.city}</div>
                <div>Code postal: {data?.postalAddress?.postalCode}</div>
                <div>globalLocationNumber: {data?.globalLocationNumber}</div>
                <div>Siren: {data?.siren}</div>
              </PanelBody>
            </Panel>
          </Grid>
        </Grid>
      </PanelBody>
    </Panel>
  )
}
