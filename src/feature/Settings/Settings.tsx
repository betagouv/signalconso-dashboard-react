import { Link } from '@tanstack/react-router'
import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useI18n } from '../../core/i18n'
import { ScButton } from '../../shared/Button'
import { Page, PageTitle } from '../../shared/Page'
import { UserNameLabel } from '../../shared/UserNameLabel'
import { EditEmailDialog } from './EditEmailDialog'
import { EditPasswordDialog } from './EditPasswordDialog'
import { EditProfileDialog } from './EditProfileDialog'
import { SettingRow } from './SettingRow'

export const Settings = () => {
  const { m } = useI18n()
  const { connectedUser } = useConnectedContext()

  return (
    <Page maxWidth="l">
      <PageTitle>{m.menu_settings}</PageTitle>
      <CleanWidePanel>
        <SettingRow
          icon="person"
          title={m.name}
          description={
            <UserNameLabel
              firstName={connectedUser.firstName}
              lastName={connectedUser.lastName}
            />
          }
        >
          <EditProfileDialog>
            <ScButton icon="edit" color="primary">
              {m.edit}
            </ScButton>
          </EditProfileDialog>
        </SettingRow>
        <SettingRow
          icon="vpn_key"
          title={m.password}
          description={m.editPasswordDesc}
        >
          <EditPasswordDialog>
            <ScButton icon="edit" color="primary">
              {m.edit}
            </ScButton>
          </EditPasswordDialog>
        </SettingRow>
        <SettingRow icon="email" title={m.email} description={m.editEmailDesc}>
          <EditEmailDialog>
            <ScButton icon="edit" color="primary">
              {m.edit}
            </ScButton>
          </EditEmailDialog>
        </SettingRow>
        {connectedUser.isPro && (
          <SettingRow
            icon="notifications"
            title={m.notifications}
            description={m.notificationSettings}
          >
            <Link to="/mes-entreprises">
              <ScButton icon="edit" color="primary">
                {m.edit}
              </ScButton>
            </Link>
          </SettingRow>
        )}
      </CleanWidePanel>
    </Page>
  )
}
