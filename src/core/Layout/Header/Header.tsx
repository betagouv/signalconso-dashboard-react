import makeStyles from '@mui/styles/makeStyles'
import {Box, Icon, Menu, MenuItem, Slide, Theme} from '@mui/material'
import logoGouvMobile from './gouv-mobile.svg'
import logoSignalConso from './signalconso.svg'
import logoDgccrf from './logo-dgccrf.png'
import {useI18n} from '../../i18n'
import {Btn, IconBtn} from 'mui-extension/lib'
import {config} from '../../../conf/config'
import {styleUtils} from 'core/theme'
import {headerHeight} from '../index'
import React from 'react'
import {ScAppMenuBtn} from '../Menu/ScAppMenuBtn'
import {useLayoutContext} from '../LayoutContext'
import {LayoutConnectedUser} from '../Layout'

interface Props {
  connectedUser?: LayoutConnectedUser
}

export const Header = ({connectedUser}: Props) => {
  const {m} = useI18n()
  const {isMobileWidth} = useLayoutContext()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
      <Box component="header" sx={{
        minHeight: headerHeight,
        py: .5, px: 2,
        display: 'flex',
        alignItems: 'center',
        background: t => t.palette.background.paper,
        borderBottom: t => '1px solid ' + t.palette.divider,
      }}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Box component="img" src={logoGouvMobile} alt={m.altLogoGouv} sx={{
            height: 40,
            mr: 2,
          }} />
          {!isMobileWidth && <Box component="img" src={logoDgccrf} alt={m.altLogoDGCCRF} sx={{
            height: 40,
            mr: 2,
          }} />}
          <a href={config.appBaseUrl}>
            <Box component="img" src={logoSignalConso} alt={m.altLogoSignalConso} sx={{
              height: 40,
              mr: 1,
            }} />
          </a>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: 'auto',
        }}>
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
          <ScAppMenuBtn connectedUser={connectedUser} />
        </div>
      </Box>
    </Slide>
  )
}

const useHeaderItemStyles = makeStyles((t: Theme) => ({
  root: {
    textTransform: 'initial',
    fontSize: styleUtils(t).fontSize.normal,
    padding: t.spacing(0, 2),
  },
}))

const HeaderItem = ({children, href}: {children: any; href: string}) => {
  const css = useHeaderItemStyles()
  return (
    <Btn color="primary" href={href} className={css.root}>
      {children}
    </Btn>
  )
}
