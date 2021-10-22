import {Avatar, Icon, Theme} from '@mui/material'
import React from 'react'
import makeStyles from '@mui/styles/makeStyles';
import {grey, lightBlue} from '@mui/material/colors'
import {styleUtils} from '../../theme'
import {useBoolean} from '@alexandreannic/react-hooks-lib/lib'
import {ScMenu} from './ScMenu'
import {LayoutConnectedUser} from '../Layout'
import {classes} from '../../helper/utils'
import {useHistory} from 'react-router'
import {siteMap} from '../../siteMap'

const useMenuStyles = makeStyles((t: Theme) => ({
  root: {
    position: 'relative',
  },
  avatar: {
    transition: t.transitions.create('all'),
    color: lightBlue[50],
    backgroundColor: lightBlue[500],
    margin: t.spacing(0, 1),
    marginRight: 0,
  },
  avatarOffline: {
    color: grey[50],
    backgroundColor: grey[500],
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
}))

interface Props {
  connectedUser?: LayoutConnectedUser
}

export const ScMenuBtn = ({connectedUser}: Props) => {
  const css = useMenuStyles()
  const openMenu = useBoolean(false)
  const history = useHistory()

  return (
    <div className={css.root}>
      <Avatar
        className={classes(css.avatar, !connectedUser && css.avatarOffline)}
        onClick={() => {
          if (connectedUser) openMenu.toggle()
          else history.push(siteMap.loggedout.login)
        }}
      >
        <Icon>{connectedUser ? 'person' : 'no_accounts'}</Icon>
      </Avatar>
      {connectedUser && openMenu.value && <ScMenu onClose={openMenu.setFalse} connectedUser={connectedUser} />}
    </div>
  )
}
