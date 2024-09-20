import { Box, Icon, Menu, MenuItem } from '@mui/material'
import logoGouvMobile from './gouv-mobile.svg'
import logoDgccrf from './logo-dgccrf.png'
import { config } from '../../conf/config'
import logoSignalConso from './logo-signalconso.png'
import { Btn, IconBtn } from '../../alexlibs/mui-extension'
import React from 'react'
import { useI18n } from '../i18n'
import { useLayoutContext } from '../Layout/LayoutContext'
import { styleUtils } from '../theme'
import { Header } from '../Layout/Header/Header'
import { User } from '../client/user/User'

const HeaderItem = ({ children, href }: { children: any; href: string }) => {
  return (
    <Btn
      color="primary"
      href={href}
      sx={{
        textTransform: 'initial',
        fontSize: (t) => styleUtils(t).fontSize.normal,
        py: 0,
        px: 2,
      }}
    >
      {children}
    </Btn>
  )
}

export const ScHeader = ({ connectedUser }: { connectedUser?: User }) => {
  const { isMobileWidth } = useLayoutContext()
  const { m } = useI18n()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Header>
      <img src={logoGouvMobile} alt={m.altLogoGouv} className="h-[40px] mr-4" />
      {!isMobileWidth && (
        <img src={logoDgccrf} alt={m.altLogoDGCCRF} className="h-[40px] mr-4" />
      )}
      <a href={config.appBaseUrl}>
        <img
          src={logoSignalConso}
          alt={m.altLogoSignalConso}
          className="h-[50px] mr-2"
        />
      </a>
      {connectedUser && connectedUser.impersonator && (
        <div className="flex ml-2 px-2 py-1 bg-yellow-200">
          <Icon>theater_comedy</Icon> Connecté en tant que pro
        </div>
      )}
      <div className="flex items-center ml-auto">
        {isMobileWidth ? (
          <>
            <IconBtn aria-haspopup="true" onClick={handleClick}>
              <Icon>menu</Icon>
            </IconBtn>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <a href={config.appBaseUrl}>
                <MenuItem>{m.home}</MenuItem>
              </a>
              <a href={config.appBaseUrl + '/comment-ca-marche'}>
                <MenuItem>{m.howItWorks}</MenuItem>
              </a>
              <a href={config.appBaseUrl + '/centre-aide'}>
                <MenuItem>{m.helpCenter}</MenuItem>
              </a>
            </Menu>
          </>
        ) : (
          <nav>
            <HeaderItem href={config.appBaseUrl}>{m.home}</HeaderItem>
            <HeaderItem href={config.appBaseUrl + '/comment-ca-marche'}>
              {m.howItWorks}
            </HeaderItem>
            <HeaderItem href={config.appBaseUrl + '/centre-aide'}>
              {m.helpCenter}
            </HeaderItem>
          </nav>
        )}
      </div>
    </Header>
  )
}
