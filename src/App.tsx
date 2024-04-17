import {CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material'
import {QueryClientProvider} from '@tanstack/react-query'
import {queryClient, setQueryClientErrorHandler} from 'queryClient'
import {useEffect} from 'react'
import {useNavigate} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {AppRoutes} from './AppRoutes'
import {RedirectHashRouterToBrowserRouter} from './RedirectHashRouterToBrowserRouter'
import {ToastProvider} from './alexlibs/mui-extension'
import {Layout} from './core/Layout'
import {ScHeader} from './core/ScHeader/ScHeader'
import {ScSidebar} from './core/ScSidebar/ScSidebar'
import {I18nProvider} from './core/i18n'
import {muiTheme} from './core/theme'
import {useToast} from './core/toast'
import {useLoginManagement} from './core/useLoginManagement'
import {Provide} from './shared/Provide'
import './style.css'

const Router: typeof BrowserRouter = BrowserRouter

export const App = () => {
  return (
    <Provide
      providers={[
        _ => <QueryClientProvider client={queryClient} children={_} />,
        _ => <ThemeProvider theme={muiTheme()} children={_} />,
        _ => <StyledEngineProvider children={_} />,
        _ => <CssBaseline children={_} />,
        _ => <Router children={_} />,
        _ => <I18nProvider children={_} />,
        _ => <ToastProvider horizontal="right" children={_} />,
      ]}
    >
      <RedirectHashRouterToBrowserRouter />
      <Application />
    </Provide>
  )
}

const Application = () => {
  const navigate = useNavigate()
  const {toastError} = useToast()

  useEffect(() => {
    setQueryClientErrorHandler(toastError)
  }, [toastError])

  function onLogout() {
    navigate('/')
  }
  const loginManagementResult = useLoginManagement({
    onLogout,
  })
  const {connectedUser, logout} = loginManagementResult

  return (
    <Layout header={<ScHeader />} sidebar={connectedUser && <ScSidebar {...{connectedUser, logout}} />}>
      <AppRoutes {...{loginManagementResult}} />
    </Layout>
  )
}
