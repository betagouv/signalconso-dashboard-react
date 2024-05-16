import {Box, Icon} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {CleanWidePanel} from 'shared/Panel/simplePanels'
import {Alert, IconBtn, Txt} from '../../alexlibs/mui-extension'
import {useAsync, useEffectFn} from '../../alexlibs/react-hooks-lib'
import {useConnectedContext} from '../../core/context/ConnectedContext'
import {useI18n} from '../../core/i18n'
import {useToast} from '../../core/toast'

export const TestTools = () => {
  const {m} = useI18n()
  const {apiSdk: api, connectedUser} = useConnectedContext()
  const {toastError} = useToast()

  const _emailCodes = useQuery({
    queryKey: ['admin_getEmailCodes'],
    queryFn: () =>
      api.secured.admin
        .getEmailCodes()
        // .then(emailCodes => emailCodes.sort())
        .then(emailCodes => ({
          divers: emailCodes.filter(_ => _.startsWith('various.')),
          admin: emailCodes.filter(_ => _.startsWith('admin.')),
          dgccrf: emailCodes.filter(_ => _.startsWith('dgccrf.')),
          pro: emailCodes.filter(_ => _.startsWith('pro.')),
          consumer: emailCodes.filter(_ => _.startsWith('consumer.')),
        })),
  })
  const _pdfCodes = useQuery({
    queryKey: ['admin_getPdfCodes'],
    queryFn: api.secured.admin.getPdfCodes,
  })

  const _sendEmail = useAsync(api.secured.admin.sendTestEmail)
  const _downloadTestPdf = useAsync(api.secured.admin.downloadTestPdf)

  useEffectFn(_sendEmail.error, toastError)
  useEffectFn(_downloadTestPdf.error, toastError)
  return (
    <div className="flex flex-row items-start justify-center gap-4 mx-auto mt-10">
      {!_emailCodes.isLoading && (
        <CleanWidePanel>
          <h2 className="font-bold mb-2 text-xl">{m.sendDummyEmail}</h2>
          <div>
            <Alert type="info" gutterBottom>
              <div dangerouslySetInnerHTML={{__html: m.allMailsWillBeSendTo(connectedUser.email)}} />
            </Alert>

            {_emailCodes.data &&
              Object.entries(_emailCodes.data).map(([type, emailCodes]) => (
                <Box key={type} sx={{mt: 3, mb: 4}}>
                  <p className="text-xl capitalize text-center text-black font-bold">{type}</p>
                  {emailCodes.map(emailCode => (
                    <Box
                      key={emailCode}
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
                          const emailCodeDisplay = (
                            <Txt color="disabled" size="small" block>
                              {emailCode}
                            </Txt>
                          )
                          try {
                            const {title, desc} = (m.testMails as any)[type][emailCode.split('.')[1]]
                            return (
                              <>
                                <Txt bold block>
                                  {title}
                                </Txt>
                                <Txt color="hint" block dangerouslySetInnerHTML={{__html: desc}} />
                                {emailCodeDisplay}
                              </>
                            )
                          } catch (e) {
                            console.error(`Missing translation for ${emailCode}`)
                            return <>{emailCodeDisplay}</>
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
          </div>
        </CleanWidePanel>
      )}
      {!_pdfCodes.isLoading && (
        <CleanWidePanel>
          <h2 className="font-bold text-lg mb-2">{m.downloadDummyPdfs}</h2>
          <div>
            {_pdfCodes.data && (
              <Box sx={{mt: 3, mb: 4}}>
                {_pdfCodes.data.map(code => {
                  const {title, desc} = ((m.testPdfs as any)[code] ?? {}) as {title?: string; desc?: string}
                  return (
                    <Box
                      key={code}
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
          </div>
        </CleanWidePanel>
      )}
    </div>
  )
}
