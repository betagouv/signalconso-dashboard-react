import {lighten} from '@mui/system/colorManipulator'
import {Box, Icon, Menu, MenuItem, Slide} from '@mui/material'
import logoGouvMobile from './gouv-mobile.svg'
import logoSignalConso from './signalconso.svg'
import logoDgccrf from './logo-dgccrf.png'
import {useI18n} from '../../i18n'
import {Btn, IconBtn} from 'mui-extension/lib'
import {config} from '../../../conf/config'
import {styleUtils} from 'core/theme'
import {layoutConfig} from '../index'
import React from 'react'
import {ScAppMenuBtn} from '../Menu/ScAppMenuBtn'
import {useLayoutContext} from '../LayoutContext'
import {UserWithPermission} from '@signal-conso/signalconso-api-sdk-js/lib/client/authenticate/Authenticate'

interface Props {
  connectedUser?: UserWithPermission
}

export const Header = ({connectedUser}: Props) => {
  const {m} = useI18n()
  const {sidebarOpen, isMobileWidth, setSidebarOpen} = useLayoutContext()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const {sidebarPinned} = useLayoutContext()
  return (
    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
      <Box
        component="header"
        sx={{
          minHeight: layoutConfig.headerHeight,
          px: layoutConfig.headerPx,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          background: t => t.palette.background.paper,
          borderBottom: t => '1px solid ' + t.palette.divider
        }}
      >
        <div style={{display: 'flex', alignItems: 'center'}}>
          <IconBtn
            sx={{
              mr: 1,
              color: t => sidebarOpen ? t.palette.primary.main : t.palette.text.disabled,
              background: t => sidebarOpen ? lighten(t.palette.primary.light, .4) : t.palette.divider,
              '&:hover': {
                // boxShadow: ''
                background: t => t.palette.primary.light,
              }
            }}
            onClick={() => setSidebarOpen(_ => !_)}
          >
            <Icon>menu</Icon>
          </IconBtn>
          <Box
            component="img"
            src={logoGouvMobile}
            alt={m.altLogoGouv}
            sx={{
              height: 40,
              mr: 2
            }}
          />
          {!isMobileWidth && (
            <Box
              component="img"
              src={logoDgccrf}
              alt={m.altLogoDGCCRF}
              sx={{
                height: 40,
                mr: 2,
              }}
            />
          )}
          <a href={config.appBaseUrl}>
            <Box
              component="img"
              src={logoSignalConso}
              alt={m.altLogoSignalConso}
              sx={{
                height: 40,
                mr: 1,
              }}
            />
          </a>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: 'auto',
          }}
        >
          {isMobileWidth ? (
            <>
              <IconBtn aria-haspopup="true" onClick={handleClick}>
                <Icon>menu</Icon>
              </IconBtn>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <a href={config.appBaseUrl}>
                  <MenuItem>{m.home}</MenuItem>
                </a>
                <a href={config.appBaseUrl + '/comment-ca-marche'}>
                  <MenuItem>{m.howItWorks}</MenuItem>
                </a>
                <a href={config.appBaseUrl + '/centre-aide/consommateur'}>
                  <MenuItem>{m.helpCenter}</MenuItem>
                </a>
              </Menu>
            </>
          ) : (
            <nav>
              <HeaderItem href={config.appBaseUrl}>{m.home}</HeaderItem>
              <HeaderItem href={config.appBaseUrl + '/comment-ca-marche'}>{m.howItWorks}</HeaderItem>
              <HeaderItem href={config.appBaseUrl + '/centre-aide/consommateur'}>{m.helpCenter}</HeaderItem>
            </nav>
          )}
        </div>
      </Box>
    </Slide>
  )
}

const HeaderItem = ({children, href}: {children: any; href: string}) => {
  return (
    <Btn
      color="primary"
      href={href}
      sx={{
        textTransform: 'initial',
        fontSize: t => styleUtils(t).fontSize.normal,
        py: 0,
        px: 2,
      }}
    >
      {children}
    </Btn>
  )
}
