import {useI18n} from '../../i18n'
import {Btn} from 'mui-extension/lib'
import {ClickAwayListener, Divider, Theme} from '@mui/material'
import {EntityIcon} from '../../EntityIcon'
import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import {styleUtils} from '../../theme'
import {ScAppMenuItem} from './ScAppMenuItem'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {siteMap} from '../../siteMap'
import {stopPropagation} from '../../helper/utils'
import {LayoutConnectedUser} from '../Layout'
import {Roles} from '@signal-conso/signalconso-api-sdk-js'

const useMenuStyles = makeStyles((t: Theme) => ({
  root: {
    position: 'absolute',
    top: 50,
    right: 0,
    background: t.palette.background.paper,
    boxShadow: t.shadows[6],
    borderRadius: 4,
    zIndex: 100,
    minWidth: 280,
  },
  user: {
    padding: t.spacing(2, 2, 0.5, 2),
  },
  userName: {
    ...styleUtils(t).truncate,
  },
  userEmail: {
    ...styleUtils(t).truncate,
    color: t.palette.text.secondary,
    fontSize: styleUtils(t).fontSize.small,
  },
  logoutBtn: {
    margin: `${t.spacing(1, 0)} !important`,
  },
  useRole: {
    fontSize: styleUtils(t).fontSize.small,
    color: t.palette.text.disabled,
  },
  divider: {
    '& + $divider': {
      display: 'none',
    },
  },
}))

interface Props {
  onClose: () => void
  connectedUser: LayoutConnectedUser
}

export const ScAppMenu = ({onClose, connectedUser}: Props) => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  const css = useMenuStyles()

  const logout = () => {
    connectedUser.logout()
    onClose()
  }

  return (
    <ClickAwayListener onClickAway={stopPropagation(onClose)}>
      <div className={css.root}>
        <div className={css.user}>
          <Txt block truncate className={css.userName}>
            {connectedUser.firstName} {connectedUser.lastName}
          </Txt>
          <Txt block truncate className={css.userEmail}>
            {connectedUser.email}
          </Txt>
          <Btn variant="outlined" size="small" icon="logout" color="primary" className={css.logoutBtn} onClick={logout}>
            {m.logout}
          </Btn>
        </div>
        <Divider className={css.divider} />
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
        <Divider className={css.divider} />
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
        <Divider className={css.divider} />
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
        <Divider className={css.divider} />
        <ScAppMenuItem onClick={onClose} to={path(siteMap.logged.settings)} icon="settings">
          {m.menu_settings}
        </ScAppMenuItem>
      </div>
    </ClickAwayListener>
  )
}
