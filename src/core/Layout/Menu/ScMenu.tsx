import {useI18n} from '../../i18n'
import {Btn} from 'mui-extension/lib'
import {ClickAwayListener, Divider, Theme} from '@material-ui/core'
import {EntityIcon} from '../../EntityIcon'
import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {styleUtils} from '../../theme'
import {ScMenuItem} from './ScMenuItem'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {siteMap} from '../../siteMap'
import {stopPropagation} from '../../helper/utils'
import {LayoutConnectedUser} from '../Layout'
import {Roles} from '@betagouv/signalconso-api-sdk-js'

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
    color: t.palette.text.hint,
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

export const ScMenu = ({onClose, connectedUser}: Props) => {
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
        <ScMenuItem onClick={onClose} to={path(siteMap.reports())} icon={EntityIcon.report}>
          {m.menu_reports}
        </ScMenuItem>
        {[Roles.Admin, Roles.DGCCRF].includes(connectedUser.role) && (
          <ScMenuItem onClick={onClose} to={path(siteMap.companies)} icon={EntityIcon.company}>
            {m.menu_companies}
          </ScMenuItem>
        )}
        {[Roles.Pro].includes(connectedUser.role) && (
          <ScMenuItem onClick={onClose} to={path(siteMap.companiesPro)} icon={EntityIcon.company}>
            {m.menu_companies}
          </ScMenuItem>
        )}
        {[Roles.Admin].includes(connectedUser.role) && (
          <ScMenuItem onClick={onClose} to={path(siteMap.users)} icon={EntityIcon.user}>
            {m.menu_users}
          </ScMenuItem>
        )}
        {[Roles.Admin, Roles.DGCCRF].includes(connectedUser.role) && (
          <ScMenuItem onClick={onClose} to={path(siteMap.subscriptions)} icon={EntityIcon.subscription}>
            {m.menu_subscriptions}
          </ScMenuItem>
        )}
        <Divider className={css.divider} />
        {[Roles.Admin, Roles.DGCCRF].includes(connectedUser.role) && (
          <ScMenuItem onClick={onClose} to={path(siteMap.reportedWebsites)} icon={EntityIcon.website}>
            {m.menu_websites}
          </ScMenuItem>
        )}
        {[Roles.Admin, Roles.DGCCRF].includes(connectedUser.role) && (
          <ScMenuItem onClick={onClose} to={path(siteMap.reportedPhone)} icon={EntityIcon.phone}>
            {m.menu_phones}
          </ScMenuItem>
        )}
        {[Roles.DGCCRF].includes(connectedUser.role) && (
          <ScMenuItem onClick={onClose} to={path(siteMap.modeEmploiDGCCRF)} icon="help">
            {m.menu_modeEmploiDGCCRF}
          </ScMenuItem>
        )}
        {[Roles.Admin].includes(connectedUser.role) && (
          <ScMenuItem onClick={onClose} to={path(siteMap.companiesDbSync)} icon="sync">
            {m.database}
          </ScMenuItem>
        )}
        <Divider className={css.divider} />
        <ScMenuItem onClick={onClose} to={path(siteMap.settings)} icon="settings">
          {m.menu_settings}
        </ScMenuItem>
      </div>
    </ClickAwayListener>
  )
}
