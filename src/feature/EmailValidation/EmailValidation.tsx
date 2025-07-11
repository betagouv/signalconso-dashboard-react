import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { publicApiSdk } from 'core/apiSdkInstances'
import { useEffect, useMemo } from 'react'
import { Fender, Txt } from '../../alexlibs/mui-extension'
import { useI18n } from '../../core/i18n'
import { User } from '../../core/model'
import { ScButton } from '../../shared/Button'
import { CenteredContent } from '../../shared/CenteredContent'
import { Page } from '../../shared/Page'

interface Props {
  onSaveUser: (_: User) => void
  token: string
}

interface FenderProps {
  type: 'loading' | 'error' | 'success'
  title: string
  description?: string
}

export const EmailValidation = ({ onSaveUser, token }: Props) => {
  const { m } = useI18n()
  const _validateEmail = useMutation({
    mutationFn: publicApiSdk.authenticate.validateEmail,
  })

  useEffect(() => {
    _validateEmail.mutateAsync(token).then(onSaveUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fenderProps = useMemo((): FenderProps => {
    if (_validateEmail.isPending) {
      return {
        type: 'loading',
        title: m.validatingEmail,
      }
    }
    if (_validateEmail.error) {
      return {
        type: 'error',
        title: m.linkNotValidAnymore,
        description: m.linkNotValidAnymoreDesc,
      }
    }
    return {
      type: 'success',
      title: m.emailValidated,
      description: m.emailValidatedDesc,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_validateEmail.isPending, _validateEmail.error])

  return (
    <CenteredContent>
      <Page>
        <Fender type={fenderProps.type} title={fenderProps.title}>
          <Txt block gutterBottom color="hint" size="big" sx={{ mt: 2 }}>
            {fenderProps.description}
          </Txt>

          {fenderProps.type !== 'loading' && fenderProps.type !== 'success' && (
            <Link to="/connexion">
              <ScButton
                sx={{ mt: 1 }}
                icon="login"
                variant="contained"
                color="primary"
              >
                {m.login}
              </ScButton>
            </Link>
          )}
        </Fender>
      </Page>
    </CenteredContent>
  )
}
