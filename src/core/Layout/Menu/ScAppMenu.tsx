import {useI18n} from '../../i18n'
import {Btn} from 'mui-extension/lib'
import {Box, ClickAwayListener} from '@mui/material'
import {EntityIcon} from '../../EntityIcon'
import React from 'react'
import {styleUtils, sxUtils} from '../../theme'
import {ScAppMenuItem} from './ScAppMenuItem'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {siteMap} from '../../siteMap'
import {stopPropagation} from '../../helper/utils'
import {LayoutConnectedUser} from '../Layout'
import {Roles} from '@signal-conso/signalconso-api-sdk-js'
import {makeSx} from 'mui-extension'
import {Divider} from '../../../shared/Divider/Divider'

const css = makeSx({
  root: {
    position: 'absolute',
    top: 50,
    right: 0,
    background: t => t.palette.background.paper,
    boxShadow: t => t.shadows[6],
    borderRadius: t => t.shape.borderRadius + 'px',
    zIndex: 100,
    minWidth: 280,
  },
  user: {
    p: 2,
    pb: .5,
  },
  userName: {
    ...sxUtils.truncate,
  },
  userEmail: {
    ...sxUtils.truncate,
    color: t => t.palette.text.secondary,
    fontSize: t => styleUtils(t).fontSize.small,
  },
  logoutBtn: {
    margin: t => `${t.spacing(1, 0)} !important`,
  },
  useRole: {
    fontSize: t => styleUtils(t).fontSize.small,
    color: t => t.palette.text.disabled,
  },
  divider: {
    '& + &': {
      display: 'none',
    },
  },
})

interface Props {
  onClose: () => void
  connectedUser: LayoutConnectedUser
}

export const ScAppMenu = ({onClose, connectedUser}: Props) => {
  const path = (page: string) => '' + page
  const {m} = useI18n()

  const logout = () => {
    connectedUser.logout()
    onClose()
  }

  return (
    <ClickAwayListener onClickAway={stopPropagation(onClose)}>
      <Box sx={css.root}>
        <Box sx={css.user}>
          <Txt block truncate sx={css.userName}>
            {connectedUser.firstName} {connectedUser.lastName}
          </Txt>
          <Txt block truncate sx={css.userEmail}>
            {connectedUser.email}
          </Txt>
          <Btn variant="outlined" size="small" icon="logout" color="primary" sx={css.logoutBtn} onClick={logout}>
            {m.logout}
          </Btn>
        </Box>
        <Divider sx={css.divider}/>
        {[Roles.Admin, Roles.DGCCRF].includes(connectedUser.role) && (
          <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.stats)} icon={EntityIcon.stats}>
            {m.menu_stats}
          </ScAppMenuItem>
        )}
        <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.reports())} icon={EntityIcon.report}>
          {m.menu_reports}
        </ScAppMenuItem>
        {[Roles.Admin, Roles.DGCCRF].includes(connectedUser.role) && (
          <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.companies)} icon={EntityIcon.company}>
            {m.menu_companies}
          </ScAppMenuItem>
        )}
        {[Roles.Pro].includes(connectedUser.role) && (
          <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.companiesPro)} icon={EntityIcon.company}>
            {m.menu_companies}
          </ScAppMenuItem>
        )}
        {[Roles.Admin].includes(connectedUser.role) && (
          <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.users)} icon={EntityIcon.user}>
            {m.menu_users}
          </ScAppMenuItem>
        )}
        {[Roles.Admin, Roles.DGCCRF].includes(connectedUser.role) && (
          <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.subscriptions)} icon={EntityIcon.subscription}>
            {m.menu_subscriptions}
          </ScAppMenuItem>
        )}
        <Divider sx={css.divider}/>
        {[Roles.Admin, Roles.DGCCRF].includes(connectedUser.role) && (
          <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.reportedWebsites)} icon={EntityIcon.website}>
            {m.menu_websites}
          </ScAppMenuItem>
        )}
        {[Roles.Admin, Roles.DGCCRF].includes(connectedUser.role) && (
          <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.reportedPhone)} icon={EntityIcon.phone}>
            {m.menu_phones}
          </ScAppMenuItem>
        )}
        {[Roles.DGCCRF].includes(connectedUser.role) && (
          <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.modeEmploiDGCCRF)} icon="help">
            {m.menu_modeEmploiDGCCRF}
          </ScAppMenuItem>
        )}
        <Divider sx={css.divider}/>
        {[Roles.Admin].includes(connectedUser.role) && (
          <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.admin)} icon={EntityIcon.admin}>
            {m.menu_admin}
          </ScAppMenuItem>
        )}
        {[Roles.Admin].includes(connectedUser.role) && (
          <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.companiesDbSync)} icon="sync">
            {m.database}
          </ScAppMenuItem>
        )}
        <Divider sx={css.divider}/>
        <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.settings)} icon="settings">
          {m.menu_settings}
        </ScAppMenuItem>
      </Box>
    </ClickAwayListener>
  )
}
