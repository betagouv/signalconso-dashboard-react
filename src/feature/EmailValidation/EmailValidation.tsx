import {Page} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {useHistory, useLocation, useParams} from 'react-router'
import {AuthUser, Id} from '@betagouv/signalconso-api-sdk-js'
import {useAsync} from '@alexandreannic/react-hooks-lib'
import {useEffect, useMemo} from 'react'
import {Fender} from 'mui-extension'
import {ScButton} from '../../shared/Button/Button'
import {NavLink} from 'react-router-dom'
import {siteMap} from '../../core/siteMap'
import {CenteredContent} from '../../shared/CenteredContent/CenteredContent'
import {headerHeight} from '../../core/Layout'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useCssUtils} from '../../core/helper/useCssUtils'
import * as querystring from 'querystring'

interface Props {
  onValidateEmail: (token: Id) => Promise<AuthUser>
  onSaveToken: (_: AuthUser) => void
}

interface FenderProps {
  type: 'loading' | 'error' | 'success'
  title: string
  description?: string
}

export const EmailValidation = ({onValidateEmail, onSaveToken}: Props) => {
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const _validateEmail = useAsync(onValidateEmail)
  const {search} = useLocation()

  useEffect(() => {
    const token = querystring.parse(search.replace(/^\?/, '')).token as string
    _validateEmail.call(token).then(onSaveToken)
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
    <CenteredContent offset={headerHeight}>
      <Page size="small">
        <Fender type={fenderProps.type} title={fenderProps.title}>
          <Txt block gutterBottom color="hint" size="big" className={cssUtils.marginTop2}>
            {fenderProps.description}
          </Txt>

          {fenderProps.type !== 'loading' && (
            <NavLink to={siteMap.login}>
              <ScButton className={cssUtils.marginTop} icon="login" variant="contained" color="primary">
                {m.login}
              </ScButton>
            </NavLink>
          )}
        </Fender>
      </Page>
    </CenteredContent>
  )
}
