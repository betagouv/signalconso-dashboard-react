import {Box, Icon, Tooltip} from '@mui/material'
import {useApiContext} from 'core/context/ApiContext'
import {useEffect} from 'react'
import {IconBtn, Txt} from '../../alexlibs/mui-extension'
import {useEffectFn} from '../../alexlibs/react-hooks-lib'
import {useFetcher} from '../../alexlibs/react-hooks-lib/useFetcher/UseFetcher'
import {useI18n} from '../../core/i18n'
import {useToast} from '../../core/toast'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Panel, PanelHead} from '../../shared/Panel'
import {ConsumerBlacklistAddDialog} from './ConsumerBlacklistAddDialog'

export const ConsumerBlacklist = () => {
  const {m} = useI18n()
  const {api} = useApiContext()
  const _blackListedEmails = useFetcher(api.secured.consumerBlacklist.list)
  const _delete = useFetcher(api.secured.consumerBlacklist.delete)

  const {toastError} = useToast()
  const {formatDate} = useI18n()

  useEffect(() => {
    _blackListedEmails.fetch()
  }, [])

  useEffectFn(_blackListedEmails.error, toastError)

  return (
    <Panel>
      <Box sx={{p: 2}}>
        <Txt color="default">
          Liste noire des consommateurs qui nous ont soumis des signalements inacceptables (injures, racisme, etc.).{' '}
          <Txt color="hint" italic>
            Ils ont l'impression de pouvoir toujours accéder au site et soumettre des signalements. En fait, leurs signalements ne
            sont plus enregistrés.
          </Txt>
        </Txt>
      </Box>
      <PanelHead sx={{pb: 2}} bottomDivider={true}>
        <ConsumerBlacklistAddDialog onAdd={_blackListedEmails.fetch} />
      </PanelHead>
      <Datatable
        loading={_blackListedEmails.loading}
        total={_blackListedEmails.entity?.length}
        getRenderRowKey={_ => _.email}
        data={_blackListedEmails.entity}
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
                    <IconBtn
                      color={'primary'}
                      onClick={() =>
                        _delete
                          .fetch({}, _.id)
                          .catch(toastError)
                          .then(() => _blackListedEmails.fetch())
                      }
                    >
                      <Icon>cancel</Icon>
                    </IconBtn>
                  </Tooltip>
                </Box>
              </>
            ),
          },
        ]}
      />
    </Panel>
  )
}
