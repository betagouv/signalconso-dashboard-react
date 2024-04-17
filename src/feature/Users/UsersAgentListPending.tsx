import {useState} from 'react'
import {IconBtn, Txt} from '../../alexlibs/mui-extension'
import {useI18n} from '../../core/i18n'
import {Datatable} from '../../shared/Datatable/Datatable'

import {Icon, Tooltip} from '@mui/material'
import {ScOption} from 'core/helper/ScOption'
import {RoleAgents, roleAgents} from '../../core/client/user/User'
import {useConnectedContext} from '../../core/context/ConnectedContext'
import {useGetAgentPendingQuery} from '../../core/queryhooks/userQueryHooks'
import {sxUtils} from '../../core/theme'
import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/ScDialog'
import {SelectRoleAgent} from '../../shared/SelectRoleAgent'

export const UsersAgentListPending = () => {
  const {m, formatDate} = useI18n()
  const {connectedUser} = useConnectedContext()
  const {toastSuccess} = useToast()
  const copyActivationLink = (token: string) => {
    let activationLink = window.location.host + '/agent/rejoindre/?token=' + token
    navigator.clipboard.writeText(activationLink).then(_ => toastSuccess(m.addressCopied))
  }

  const [selectedRole, setSelectedRole] = useState<RoleAgents[]>(roleAgents.map(_ => _))

  const _agentPending = useGetAgentPendingQuery(selectedRole.length === 1 ? selectedRole[0] : undefined)

  return (
    <>
      <Datatable
        id="userslistpending"
        superheader={
          <p>
            Cette page liste les agents à qui un mail d'invitation a été envoyé pour créer leur compte sur SignalConso, et qui ne
            l'ont pas encore utilisé.
          </p>
        }
        actions={<SelectRoleAgent value={selectedRole} onChange={_ => setSelectedRole(_)} />}
        headerMarginBottom
        loading={_agentPending.isLoading}
        total={_agentPending.data?.length}
        data={_agentPending.data}
        columns={[
          {
            id: 'email',
            head: m.email,
            render: _ => <Txt bold>{_.email}</Txt>,
          },
          {
            head: 'Type',
            id: 'type',
            render: _ => _.role,
          },
          {
            id: 'tokenCreation',
            head: m.invitationDate,
            render: _ => formatDate(_.tokenCreation),
          },
          {
            id: 'actions',
            sx: _ => sxUtils.tdActions,
            head: '',
            render: _ => (
              <>
                {connectedUser.isAdmin &&
                  ScOption.from(_.email)
                    .map(email => (
                      <ScDialog title={m.resendCompanyAccessToken(_.email)} onConfirm={(event, close) => null} maxWidth="xs">
                        <Tooltip title={m.resendInvite}>
                          <IconBtn>
                            <Icon>send</Icon>
                          </IconBtn>
                        </Tooltip>
                      </ScDialog>
                    ))
                    .getOrElse(<></>)}
                {connectedUser.isAdmin &&
                  ScOption.from(_.token)
                    .map(token => (
                      <Tooltip title={m.copyInviteLink}>
                        <IconBtn onClick={_ => copyActivationLink(token)}>
                          <Icon>content_copy</Icon>
                        </IconBtn>
                      </Tooltip>
                    ))
                    .getOrElse(<></>)}
              </>
            ),
          },
        ]}
      />
    </>
  )
}
