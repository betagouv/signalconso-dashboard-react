import {Box, Icon} from '@mui/material'
import {useEffect} from 'react'
import {Alert, IconBtn, Txt} from '../../alexlibs/mui-extension'
import {useAsync, useEffectFn, useFetcher} from '../../alexlibs/react-hooks-lib'
import {useLogin} from '../../core/context/LoginContext'
import {useI18n} from '../../core/i18n'
import {useToast} from '../../core/toast'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'

export const TestTools = () => {
  const {m} = useI18n()
  const {apiSdk: api, connectedUser} = useLogin()
  const {toastError} = useToast()

  const _emailCodes = useFetcher<() => Promise<{dgccrf: string[]; pro: string[]; consumer: string[]}>>(() =>
    api.secured.admin
      .getEmailCodes()
      .then(emailCodes => emailCodes.sort())
      .then(emailCodes => ({
        dgccrf: emailCodes.filter(_ => _.startsWith('dgccrf.')),
        pro: emailCodes.filter(_ => _.startsWith('pro.')),
        consumer: emailCodes.filter(_ => _.startsWith('consumer.')),
      })),
  )
  const _pdfCodes = useFetcher<() => Promise<string[]>>(() => api.secured.admin.getPdfCodes())
  const _sendEmail = useAsync(api.secured.admin.sendTestEmail)
  const _downloadTestPdf = useAsync(api.secured.admin.downloadTestPdf)

  useEffect(() => {
    _emailCodes.fetch()
    _pdfCodes.fetch()
  }, [])

  useEffectFn(_emailCodes.error, toastError)
  useEffectFn(_sendEmail.error, toastError)
  useEffectFn(_downloadTestPdf.error, toastError)

  return (
    <div className="flex justify-center gap-4 mx-auto mt-10">
      <div className="w-full max-w-lg">
        <Panel loading={_emailCodes.loading}>
          <PanelHead>{m.sendDummyEmail}</PanelHead>
          <PanelBody>
            <Alert type="info" gutterBottom>
              <div dangerouslySetInnerHTML={{__html: m.allMailsWillBeSendTo(connectedUser.email)}} />
            </Alert>

            {_emailCodes.entity &&
              Object.entries(_emailCodes.entity).map(([type, emailCodes]) => (
                <Box key={type} sx={{mt: 3, mb: 4}}>
                  <p className="text-xl capitalize text-center text-black font-bold">{type}</p>
                  {emailCodes.map(emailCode => (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 1.5,
                        borderBottom: t => `1px solid ${t.palette.divider}`,
                      }}
                    >
                      <Box
                        sx={{
                          flex: 1,
                        }}
                      >
                        {(() => {
                          try {
                            const {title, desc} = (m.testMails as any)[type][emailCode.split('.')[1]]
                            return (
                              <>
                                <Txt bold block>
                                  {title}
                                </Txt>
                                <Txt color="hint" block dangerouslySetInnerHTML={{__html: desc}} />
                                <Txt color="disabled" size="small" block>
                                  {emailCode}
                                </Txt>
                              </>
                            )
                          } catch (e) {
                            console.error(`Missing translation for ${emailCode}`)
                            return <></>
                          }
                        })()}
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
                    </Box>
                  ))}
                </Box>
              ))}
          </PanelBody>
        </Panel>
      </div>
      <div className="w-full max-w-lg mx-auto">
        <Panel loading={_pdfCodes.loading}>
          <PanelHead>{m.downloadDummyPdfs}</PanelHead>
          <PanelBody>
            {_pdfCodes.entity && (
              <Box sx={{mt: 3, mb: 4}}>
                {_pdfCodes.entity.map(code => {
                  const {title, desc} = ((m.testPdfs as any)[code] ?? {}) as {title?: string; desc?: string}
                  return (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 1.5,
                        borderBottom: t => `1px solid ${t.palette.divider}`,
                      }}
                    >
                      <Box
                        sx={{
                          flex: 1,
                        }}
                      >
                        {title && (
                          <Txt bold block>
                            {title}
                          </Txt>
                        )}
                        {desc && <Txt color="hint" block dangerouslySetInnerHTML={{__html: desc}} />}
                        <Txt color="disabled" size="small" block>
                          {code}
                        </Txt>
                      </Box>
                      <Box>
                        <IconBtn color="primary" loading={_downloadTestPdf.loading} onClick={() => _downloadTestPdf.call(code)}>
                          <Icon>download</Icon>
                        </IconBtn>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            )}
          </PanelBody>
        </Panel>
      </div>
    </div>
  )
}
