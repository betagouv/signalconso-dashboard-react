import {Box, Icon, Tooltip} from '@mui/material'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useApiContext} from 'core/context/ApiContext'
import {IconBtn, Txt} from '../../alexlibs/mui-extension'
import {useI18n} from '../../core/i18n'
import {ListConsumerBlacklistQueryKeys, useListConsumerBlacklistQuery} from '../../core/queryhooks/consumerBlacklistQueryHooks'
import {Datatable} from '../../shared/Datatable/Datatable'
import {ConsumerBlacklistAddDialog} from './ConsumerBlacklistAddDialog'

export const ConsumerBlacklist = () => {
  const {m} = useI18n()
  const {api} = useApiContext()
  const queryClient = useQueryClient()
  const _blackListedEmails = useListConsumerBlacklistQuery()
  const _delete = useMutation({
    mutationFn: api.secured.consumerBlacklist.delete,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ListConsumerBlacklistQueryKeys}),
  })

  const {formatDate} = useI18n()

  return (
    <>
      <Datatable
        superheader={
          <div className="">
            <p className="mb-2">
              Liste noire des consommateurs qui nous ont soumis des signalements inacceptables (injures, racisme, etc.).{' '}
              <Txt color="hint" italic>
                Ils ont l'impression de pouvoir toujours accéder au site et soumettre des signalements. En fait, leurs
                signalements ne sont plus enregistrés.
              </Txt>
            </p>
            <div className="">
              <ConsumerBlacklistAddDialog />
            </div>
          </div>
        }
        loading={_blackListedEmails.isLoading}
        total={_blackListedEmails.data?.length}
        getRenderRowKey={_ => _.email}
        data={_blackListedEmails.data}
        columns={[
          {
            id: 'email',
            head: m.email,
            render: _ => <Txt bold>{_.email}</Txt>,
          },
          {
            head: m.addedDate,
            id: 'creationDate',
            render: _ => formatDate(_.creationDate),
          },
          {
            id: 'comments',
            head: m.comment,
            render: _ => <Txt bold>{_.comments}</Txt>,
          },
          {
            id: 'actions',
            head: '',
            render: _ => (
              <>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <Tooltip title={m.unblockConsumer} placement="left">
                    <IconBtn color={'primary'} onClick={() => _delete.mutate(_.id)}>
                      <Icon>cancel</Icon>
                    </IconBtn>
                  </Tooltip>
                </Box>
              </>
            ),
          },
        ]}
      />
    </>
  )
}
