import { Store, StoreOutlined } from '@mui/icons-material'
import { Chip, Icon } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Alert, Txt } from '../../alexlibs/mui-extension'
import { VisibleUser } from '../../core/client/company-access/VisibleUser'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useToast } from '../../core/context/toast/toastContext'
import { useI18n } from '../../core/i18n'
import { Id, User } from '../../core/model'
import {
  FetchVisibleUsersToProKeys,
  useFetchVisibleUsersToProQuery,
} from '../../core/queryhooks/userQueryHooks'
import { ScButton } from '../../shared/Button'
import { Datatable } from '../../shared/Datatable/Datatable'
import { Page, PageTitle } from '../../shared/Page'
import { ScDialog } from '../../shared/ScDialog'
import { CompanyAccessCreateBtn } from '../CompanyAccesses/CompanyAccessCreateBtn'

export const UsersPro = () => {
  const { m } = useI18n()
  const { connectedUser, api } = useConnectedContext()
  const queryClient = useQueryClient()
  const { toastError, toastSuccess } = useToast()
  const addTo = 'Inviter sur toutes mes entreprises'
  const removeTxt = 'Retirer'
  const upgradeTxt = 'Accès total'

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
      <div className="mb-4">
        <p className="mb-2 font-bold">
          Cette page vous permet de gérer rapidement l'accès d'un utilisateur à
          l'ensemble des entreprises dont vous êtes administrateurs.
        </p>
        <p>Vous pouvez : </p>
        <ul className="list-disc list-inside mb-2">
          <li>
            Ajouter un utilisateur à toutes vos entreprises en cliquant sur «{' '}
            {addTo} ».
          </li>
          <li>
            Supprimer un utilisateur de tous les comptes auxquels il a
            actuellement accès en cliquant sur « {removeTxt} ».
          </li>
          <li>
            Donner à un utilisateur ayant déjà accès à certaines entreprises,
            les accès à toutes les entreprises en cliquant sur « {upgradeTxt} ».
          </li>
        </ul>
        <p className="mb-2">
          Pour gérer finement les accès, établissement par établissement,
          utilisez la page <Link to="/mes-entreprises">Mes Entreprises</Link>
        </p>
        <Alert type="warning">
          Attention : ces actions sont globales et affectent toutes les
          entreprises en une seule opération. Vérifiez bien avant de confirmer.
        </Alert>
      </div>
      <Datatable
        id="pro-users"
        superheader={
          <div className="flex flex-row-reverse">
            <CompanyAccessCreateBtn
              title={addTo}
              loading={_invite.isPending}
              onCreate={(email) => _invite.mutateAsync(email)}
            />
          </div>
        }
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
                  user={_.user}
                  upgrade={_invite.mutateAsync}
                  loading={_invite.isPending}
                  title={upgradeTxt}
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
                title={removeTxt}
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
  user,
  upgrade,
  loading,
  title,
}: {
  user: User
  upgrade: (email: string) => Promise<any>
  loading: boolean
  title: string
}) => {
  return (
    <ScDialog
      title={`Donner accès à mes entreprises à ${user.firstName} ${user.lastName} ?`}
      onConfirm={(event, close) => upgrade(user.email).then(close)}
      maxWidth="sm"
      confirmLabel="Donner l'accès total"
      content={
        <>
          <p>
            Cette action donnera l'accès de cet utilisateur à toutes vos
            entreprises dont vous êtes administrateur.
          </p>
          <p className="font-bold">
            Il sera tout comme vous administrateur de ces entreprises.
          </p>
        </>
      }
    >
      <ScButton
        icon="keyboard_double_arrow_up"
        color="primary"
        variant="outlined"
        loading={loading}
      >
        {title}
      </ScButton>
    </ScDialog>
  )
}

const RevokeAccessBtn = ({
  user,
  revoke,
  loading,
  title,
}: {
  user: User
  revoke: (userId: Id) => Promise<any>
  loading: boolean
  title: string
}) => {
  return (
    <ScDialog
      title={`Retirer l'accès de ${user.firstName} ${user.lastName} ?`}
      onConfirm={(event, close) => revoke(user.id).then(close)}
      maxWidth="sm"
      confirmLabel="Retirer"
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
      <ScButton icon="clear" color="warning" loading={loading}>
        {title}
      </ScButton>
    </ScDialog>
  )
}
