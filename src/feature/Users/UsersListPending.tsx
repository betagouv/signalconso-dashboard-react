import React, {useState} from 'react'
import {Panel} from '../../shared/Panel'
import {Datatable} from '../../shared/Datatable/Datatable'
import {useI18n} from '../../core/i18n'
import {IconBtn, Txt} from '../../alexlibs/mui-extension'

import {useToast} from '../../core/toast'
import {ScDialog} from '../../shared/ScDialog'
import {Box, Icon, Tooltip} from '@mui/material'
import {useLogin} from '../../core/context/LoginContext'
import {sxUtils} from '../../core/theme'
import {ScOption} from 'core/helper/ScOption'
import {roleAgents, RoleAgents} from '../../core/client/user/User'
import {SelectRoleAgent} from '../../shared/SelectRoleAgent'
import {useGetAgentPendingQuery} from '../../core/queryhooks/userQueryHooks'

export const UsersListPending = () => {
  const {m, formatDate} = useI18n()
  const {connectedUser} = useLogin()
  const {toastError, toastSuccess} = useToast()
  const copyActivationLink = (token: string) => {
    let activationLink = window.location.host + '/#/agent/rejoindre/?token=' + token
    navigator.clipboard.writeText(activationLink).then(_ => toastSuccess(m.addressCopied))
  }

  const [selectedRole, setSelectedRole] = useState<RoleAgents[]>(roleAgents.map(_ => _))

  const _agentPending = useGetAgentPendingQuery(selectedRole.length === 1 ? selectedRole[0] : undefined)

  return (
    <>
      <Datatable
        id="userslistpending"
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
                      <ScDialog
                        title={m.resendCompanyAccessToken(_.email)}
                        onConfirm={
                          (event, close) => null
                          // _invite
                          //   .fetch({}, email)
                          //   .then(_ => close())
                          //   .then(_ => toastSuccess(m.userInvitationSent))
                        }
                        maxWidth="xs"
                      >
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
