import {useI18n} from '../../i18n'
import {Btn} from 'mui-extension/lib'
import {ClickAwayListener, Divider, Theme} from '@material-ui/core'
import {EntityIcon} from '../../EntityIcon'
import React from 'react'
import {useLoginContext} from '../../../App'
import {makeStyles} from '@material-ui/core/styles'
import {utilsStyles} from '../../theme'
import {MenuItem} from './MenuItem'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {siteMap} from '../../siteMap'
import {stopPropagation} from '../../helper/utils'
import {User} from '../../api'

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
    padding: t.spacing(2, 2, .5, 2),
  },
  userName: {
    ...utilsStyles(t).truncate,
  },
  userEmail: {
    ...utilsStyles(t).truncate,
    color: t.palette.text.secondary,
    fontSize: utilsStyles(t).fontSize.small,
  },
  logoutBtn: {
    margin: `${t.spacing(1, 0)} !important`,
  },
  useRole: {
    fontSize: utilsStyles(t).fontSize.small,
    color: t.palette.text.hint,
  },
}))

interface Props {
  onClose: () => void
  logout: () => void
  connectedUser: User
}

export const Menu = ({onClose, logout, connectedUser}: Props) => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  const css = useMenuStyles()

  return (
    <ClickAwayListener onClickAway={stopPropagation(onClose)}>
      <div className={css.root}>
        <div className={css.user}>
          <Txt block truncate className={css.userName}>{connectedUser.firstName} {connectedUser.lastName}</Txt>
          <Txt block truncate className={css.userEmail}>{connectedUser.email}</Txt>
          <Btn variant="outlined" size="small" onClick={logout} icon="logout" color="primary" className={css.logoutBtn}>
            {m.logout}
          </Btn>
        </div>
        <Divider/>
        <MenuItem onClick={onClose} to={path(siteMap.reports())} icon={EntityIcon.report}>{m.menu_reports}</MenuItem>
        <MenuItem onClick={onClose} to={path(siteMap.companies)} icon={EntityIcon.company}>{m.menu_companies}</MenuItem>
        <MenuItem onClick={onClose} to={path(siteMap.users)} icon={EntityIcon.user}>{m.menu_users}</MenuItem>
        <MenuItem onClick={onClose} to={path(siteMap.subscriptions)} icon={EntityIcon.subscription}>{m.menu_subscriptions}</MenuItem>
        <Divider/>
        <MenuItem onClick={onClose} to={path(siteMap.reportedWebsites)} icon={EntityIcon.website}>{m.menu_websites}</MenuItem>
        <MenuItem onClick={onClose} to={path(siteMap.reportedPhone)} icon={EntityIcon.phone}>{m.menu_phones}</MenuItem>
        <Divider/>
        <MenuItem onClick={onClose} to={path(siteMap.settings)} icon="settings">{m.menu_settings}</MenuItem>
      </div>
    </ClickAwayListener>
  )
}



