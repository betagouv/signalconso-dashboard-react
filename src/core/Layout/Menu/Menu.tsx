import {useI18n} from '../../i18n'
import {Btn} from 'mui-extension/lib'
import {ClickAwayListener, Divider, Theme} from '@material-ui/core'
import {Icons} from '../../Icons'
import React from 'react'
import {useLoginContext} from '../../../App'
import {makeStyles} from '@material-ui/core/styles'
import {utilsStyles} from '../../theme'
import {MenuItem} from './MenuItem'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {siteMap} from '../../siteMap'

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
}

export const Menu = ({onClose}: Props) => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  const {apiSdk, logout, connectedUser} = useLoginContext()
  const css = useMenuStyles()

  return (
    <ClickAwayListener onClickAway={onClose}>
      <div className={css.root}>
        <div className={css.user}>
          <Txt block truncate className={css.userName}>{connectedUser.firstName} {connectedUser.lastName}</Txt>
          <Txt block truncate className={css.userEmail}>{connectedUser.email}</Txt>
          <Btn variant="outlined" size="small" onClick={logout} icon="logout" color="primary" className={css.logoutBtn}>
            {m.logout}
          </Btn>
        </div>
        <Divider/>
        <MenuItem onClick={onClose} to={path(siteMap.reports())} icon={Icons.report}>{m.menu_reports}</MenuItem>
        <MenuItem onClick={onClose} to={path(siteMap.companies)} icon={Icons.company}>{m.menu_companies}</MenuItem>
        <MenuItem onClick={onClose} to={path(siteMap.users)} icon={Icons.user}>{m.menu_users}</MenuItem>
        <MenuItem onClick={onClose} to={path(siteMap.subscriptions)} icon={Icons.subscription}>{m.menu_subscriptions}</MenuItem>
        <Divider/>
        <MenuItem onClick={onClose} to={path(siteMap.reportedWebsites)} icon={Icons.website}>{m.menu_websites}</MenuItem>
        <MenuItem onClick={onClose} to={path(siteMap.reportedPhone)} icon={Icons.phone}>{m.menu_phones}</MenuItem>
      </div>
    </ClickAwayListener>
  )
}



