import {Page, PageTitle} from 'shared/Layout'
import {useI18n} from '../../core/i18n'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {useLogin} from '../../core/context/LoginContext'
import {useAsync} from '@alexandreannic/react-hooks-lib'
import {useEffect} from 'react'
import {Box, Icon, useTheme} from '@mui/material'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {Alert, IconBtn} from 'mui-extension'
import {useEffectFn} from '../../shared/hooks/UseEffectFn'
import {useToast} from '../../core/toast'

export const Admin = () => {
  const {m} = useI18n()
  const {apiSdk: api, connectedUser} = useLogin()
  const {toastError} = useToast()

  const _emailCodes = useFetcher<() => Promise<{dgccrf: string[], pro: string[], consumer: string[]}>>(() => api.secured.admin.getEmailCodes()
    .then(emailCodes => ({
      dgccrf: emailCodes.filter(_ => _.startsWith('dgccrf.')),
      pro: emailCodes.filter(_ => _.startsWith('pro.')),
      consumer: emailCodes.filter(_ => _.startsWith('consumer.')),
    })),
  )
  const _sendEmail = useAsync(api.secured.admin.sendTestEmail)

  useEffect(() => {
    _emailCodes.fetch()
  }, [])

  useEffectFn(_emailCodes.error, toastError)
  useEffectFn(_sendEmail.error, toastError)

  return (
    <Page size="small">
      <PageTitle>{m.menu_admin}</PageTitle>
      <Panel loading={_emailCodes.loading}>
        <PanelHead>{m.sendDummEmail}</PanelHead>
        <PanelBody>
          <Alert type="info" gutterBottom>
            <div dangerouslySetInnerHTML={{__html: m.allMailsWillBeSendTo(connectedUser.email)}}/>
          </Alert>

          {_emailCodes.entity && Object.entries(_emailCodes.entity).map(([type, emailCodes]) =>
            <Box key={type} sx={{mt: 2, mb: 3}}>
              <Txt size="big" bold>{type}</Txt>
              {emailCodes.map(emailCode =>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  // py: .5,
                  borderBottom: t => `1px solid ${t.palette.divider}`,
                }}>
                  <Box sx={{
                    flex: 1,
                  }}>
                    {emailCode.split('.')[1]}
                  </Box>
                  <Box>
                    <IconBtn
                      color="primary"
                      loading={_sendEmail.loading}
                      onClick={() => _sendEmail.call(emailCode, connectedUser.email)}
                    >
                      <Icon>send</Icon>
                    </IconBtn>
                  </Box>
                </Box>,
              )}
            </Box>,
          )}
        </PanelBody>
      </Panel>

    </Page>
  )
}
