import { Datatable } from '../../shared/Datatable/Datatable'
import { useI18n } from '../../core/i18n'
import { useConnectedContext } from '../../core/context/ConnectedContext'
import { Txt } from '../../alexlibs/mui-extension'
import { Chip, Icon } from '@mui/material'
import { ScButton } from '../../shared/Button'
import { Page, PageTitle } from '../../shared/Page'
import {
  FetchVisibleUsersToProKeys,
  useFetchVisibleUsersToProQuery,
} from '../../core/queryhooks/userQueryHooks'
import { CompanyAccessCreateBtn } from '../CompanyAccesses/CompanyAccessCreateBtn'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../core/context/toastContext'
import { Id, User } from '../../core/model'
import { ScDialog } from '../../shared/ScDialog'
import { Store } from '@mui/icons-material'
import { StoreOutlined } from '@mui/icons-material'
import { VisibleUser } from '../../core/client/company-access/VisibleUser'
import { siteMap } from '../../core/siteMap'
import { NavLink } from 'react-router-dom'

export const UsersPro = () => {
  const { m } = useI18n()
  const { connectedUser, api } = useConnectedContext()
  const queryClient = useQueryClient()
  const { toastError, toastSuccess } = useToast()
  const addTo = 'Ajouter à mes entreprises'

  const _visibleUsers = useFetchVisibleUsersToProQuery()
  const users = _visibleUsers.data?.filter(
    (_) => _.user.id !== connectedUser.id,
  )
  const me = _visibleUsers.data?.find((_) => _.user.id === connectedUser.id)

  const _invite = useMutation({
    mutationFn: api.secured.companyAccess.inviteProToCompanies,
    onSuccess: (email) => {
      toastSuccess(
        `Utilisateur ajouté avec succès ! ${email} a désormais accès à toutes vos entreprises.`,
      )
      return queryClient.invalidateQueries({
        queryKey: FetchVisibleUsersToProKeys,
      })
    },
    onError: (e) => toastError({ message: e.message }),
  })

  const _revoke = useMutation({
    mutationFn: api.secured.companyAccess.revokeProFromCompanies,
    onSuccess: (email) => {
      toastSuccess(
        `Utilisateur révoqué avec succès ! ${email} n'a désormais plus accès à vos entreprises.`,
      )
      return queryClient.invalidateQueries({
        queryKey: FetchVisibleUsersToProKeys,
      })
    },
    onError: (e) => toastError({ message: e.message }),
  })

  return (
    <Page>
      <PageTitle>Utilisateurs</PageTitle>
      <div className="flex justify-between gap-2 items-end mb-2">
        <div>
          <p className="mb-2">
            Cette page liste tous les utilisateurs ayant accès aux
            établissements dont vous êtes <strong>Administrateur.</strong>
          </p>
          <p>Vous pouvez : </p>
          <ul className="list-disc list-inside mb-4">
            <li>
              Inviter un nouvel un utilisateur en cliquant sur "{addTo}".
              L'utilisateur aura accès à toutes vos entreprises.
            </li>
            <li>Révoquer les accès d'un utilisateur.</li>
            <li>
              Mettre à niveau un utilisateur, c'est à dire lui donner exactement
              les mêmes accès que vous.
            </li>
          </ul>
          <p>
            Pour gérer finement les accès, établissement par établissement,
            utilisez la page{' '}
            <NavLink to={siteMap.logged.companiesPro}>Entreprises</NavLink>
          </p>
        </div>
        <div>
          <CompanyAccessCreateBtn
            title={addTo}
            loading={_invite.isPending}
            onCreate={(email) => _invite.mutateAsync(email)}
          />
        </div>
      </div>
      <Datatable
        id="pro-users"
        data={users}
        columns={[
          {
            head: m.firstName,
            id: 'firstName',
            render: (_) => _.user.firstName,
          },
          {
            head: m.lastName,
            id: 'lastName',
            render: (_) => _.user.lastName,
          },
          {
            id: 'email',
            head: m.email,
            render: (_) => (
              <Txt bold>
                <Icon
                  sx={{ mb: -0.5, mr: 1, color: (t) => t.palette.primary.main }}
                >
                  {'badge'}
                </Icon>
                {_.user.email}
              </Txt>
            ),
          },
          {
            head: 'Accès à vos entreprises',
            id: 'count',
            render: (_) => (me ? <CompanyCount user={_} me={me} /> : null),
          },
          {
            id: 'Upgrade',
            render: (_) =>
              _.count !== me?.count ? (
                <UpgradeBtn
                  email={_.user.email}
                  upgrade={_invite.mutate}
                  loading={_invite.isPending}
                />
              ) : null,
          },
          {
            id: 'revoke',
            render: (_) => (
              <RevokeAccessBtn
                user={_.user}
                revoke={_revoke.mutateAsync}
                loading={_revoke.isPending}
              />
            ),
          },
        ]}
      />
    </Page>
  )
}

const CompanyCount = ({ user, me }: { user: VisibleUser; me: VisibleUser }) => {
  if (user.count === me.count) {
    return (
      <Chip
        color="success"
        icon={<Store />}
        label={`${user.count} / ${me.count}`}
      />
    )
  } else {
    return (
      <Chip
        variant="outlined"
        icon={<StoreOutlined />}
        label={`${user.count} / ${me.count}`}
      />
    )
  }
}

const UpgradeBtn = ({
  email,
  upgrade,
  loading,
}: {
  email: string
  upgrade: (email: string) => void
  loading: boolean
}) => {
  return (
    <ScButton
      icon="keyboard_double_arrow_up"
      color="primary"
      variant="outlined"
      loading={loading}
      onClick={() => upgrade(email)}
    >
      Mettre à niveau
    </ScButton>
  )
}

const RevokeAccessBtn = ({
  user,
  revoke,
  loading,
}: {
  user: User
  revoke: (userId: Id) => Promise<any>
  loading: boolean
}) => {
  return (
    <ScDialog
      title={`Révoquer l'accès de ${user.firstName} ${user.lastName} ?`}
      onConfirm={(event, close) => revoke(user.id).then(close)}
      maxWidth="sm"
      confirmLabel="Révoquer"
      content={
        <>
          <p>
            Cette action retira l'accès de cet utilisateur à toutes vos
            entreprises.
          </p>
          <p>
            Si vous effectuez cette action pour erreur, vous pourrez le
            re-inviter.
          </p>
        </>
      }
    >
      <ScButton icon="delete" color="warning" loading={loading}>
        Révoquer
      </ScButton>
    </ScDialog>
  )
}
