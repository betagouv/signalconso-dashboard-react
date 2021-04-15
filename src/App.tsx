import React from 'react'
import {makeLoginProviderComponent} from './core/Login/LoginContext'
import {Reports} from './feature/Reports/Reports'
import {ApiClient, ApiPublicSdk, ApiSecuredSdk, User} from '@signalconso/signalconso-api-sdk-js/build'
import {Config} from './conf/config'
import {makeStyles} from '@material-ui/styles'
import {Theme} from '@material-ui/core'

const apiPublicSdk = new ApiPublicSdk(new ApiClient({
  baseUrl: Config.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}))

const makePrivateSdk = (token: string) => ({
  public: apiPublicSdk,
  secured: new ApiSecuredSdk(new ApiClient({
    baseUrl: Config.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Auth-Token': token
    }
  }))
})

export type SignalConsoApiSdk = ReturnType<typeof makePrivateSdk>

export const Login = makeLoginProviderComponent<User, SignalConsoApiSdk>(apiPublicSdk.authenticate.login, makePrivateSdk)

const useStyles = makeStyles((t: Theme) => {
  console.log(t)
  return ({
    '@global': {
      '*': {
        boxSizing: 'border-box',
      },
      '.material-icons': {
        display: 'inherit !important',
      },
      html: {
        fontSize: t.typography.fontSize,
      },
      body: {
        fontFamily: t.typography.fontFamily,
        background: t.palette.background.paper,
        margin: 0,
        color: t.palette.text.primary,
        boxSizing: 'border-box',
      },
      ul: {
        marginTop: '.5em'
      },
      h1: t.typography.h4,
      h2: {
        ...t.typography.h6,
        marginBottom: t.spacing(2),
        marginTop: t.spacing(3),
      },
      p: {
        ...t.typography.body1,
        textAlign: 'justify',
      },
      a: {
        color: 'inherit',
        textDecoration: 'none',
      },
      ':focus': {
        outline: 0,
      },
    },
  })
})

const App = () => {
  useStyles()
  return (
    <Login>
      <Reports/>
    </Login>
  )
}

export default App

