import {Divider, Icon, List, ListItem, ListItemIcon, ListItemText} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {Company} from '../../../core/client/company/Company'
import {useI18n} from '../../../core/i18n'
import {AddressComponent} from '../../../shared/Address'
import {Panel, PanelBody, PanelHead} from '../../../shared/Panel'

interface Props {
  company: Company
}

export const CompanyInfo = ({company}: Props) => {
  const {m, formatDate} = useI18n()

  const _activityCodes = useQuery({
    queryKey: ['asyncImportActivityCodes'],
    queryFn: () => import('../../../core/activityCodes').then(_ => _.activityCodes),
  })

  return (
    <Panel loading={_activityCodes.isLoading}>
      <PanelHead>{m.informations}</PanelHead>
      <PanelBody>
        <List>
          <ListItem>
            <ListItemIcon>
              <Icon>location_on</Icon>
            </ListItemIcon>
            <ListItemText primary={m.address} secondary={<AddressComponent address={company.address} />} />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <Icon>event</Icon>
            </ListItemIcon>
            <ListItemText primary={m.creationDate} secondary={formatDate(company.creationDate)} />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <Icon>label</Icon>
            </ListItemIcon>
            {_activityCodes.data && (
              <ListItemText
                primary={m.activityCode}
                secondary={company.activityCode ? _activityCodes.data[company.activityCode] : ''}
              />
            )}
          </ListItem>
        </List>
      </PanelBody>
    </Panel>
  )
}
