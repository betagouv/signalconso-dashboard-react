import {GS1Product} from '../../core/client/gs1/GS1Product'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {Id} from '../../core/model'
import {useApiContext} from '../../core/context/ApiContext'
import {useQuery} from '@tanstack/react-query'
import {WithInlineIcon} from '../../shared/WithInlineIcon'

interface ReportGS1ProductProps {
  gs1ProductId: Id
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
        <WithInlineIcon icon="shopping_cart">Fiche produit</WithInlineIcon>
      </PanelHead>
      <PanelBody>{data?.description}</PanelBody>
    </Panel>
  )
}
