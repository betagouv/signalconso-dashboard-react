import {Page} from '../../shared/Page'
import {useI18n} from '../../core/i18n'
import {useLocation} from 'react-router'
import {useAsync} from '../../alexlibs/react-hooks-lib'
import {useEffect, useMemo} from 'react'
import {Fender} from '../../alexlibs/mui-extension'
import {ScButton} from '../../shared/Button'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {CenteredContent} from '../../shared/CenteredContent'
import {Txt} from '../../alexlibs/mui-extension'
import {QueryString} from '../../core/helper/useQueryString'
import {UserWithPermission} from '../../core/client/authenticate/Authenticate'
import {Id} from '../../core/model'

interface Props {
  onValidateEmail: (token: Id) => Promise<UserWithPermission>
  onSaveUser: (_: UserWithPermission) => void
}

interface FenderProps {
  type: 'loading' | 'error' | 'success'
  title: string
  description?: string
}

export const EmailValidation = ({onValidateEmail, onSaveUser}: Props) => {
  const {m} = useI18n()
  const _validateEmail = useAsync(onValidateEmail)
  const {search} = useLocation()

  useEffect(() => {
    const token = QueryString.parse(search.replace(/^\?/, '')).token as string
    _validateEmail.call(token).then(onSaveUser)
  }, [])

  const fenderProps = useMemo((): FenderProps => {
    if (_validateEmail.loading) {
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
  }, [_validateEmail.loading, _validateEmail.error])

  return (
    <CenteredContent>
      <Page maxWidth="s">
        <Fender type={fenderProps.type} title={fenderProps.title}>
          <Txt block gutterBottom color="hint" size="big" sx={{mt: 2}}>
            {fenderProps.description}
          </Txt>

          {fenderProps.type !== 'loading' && (
            <NavLink to={siteMap.loggedout.login}>
              <ScButton sx={{mt: 1}} icon="login" variant="contained" color="primary">
                {m.login}
              </ScButton>
            </NavLink>
          )}
        </Fender>
      </Page>
    </CenteredContent>
  )
}
