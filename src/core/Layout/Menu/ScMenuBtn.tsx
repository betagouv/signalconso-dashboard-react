import {Avatar, Icon, Theme} from '@material-ui/core'
import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {grey, lightBlue} from '@material-ui/core/colors'
import {utilsStyles} from '../../theme'
import {useBoolean} from '@alexandreannic/react-hooks-lib/lib'
import {ScMenu} from './ScMenu'
import {LayoutConnectedUser} from '../Layout'
import {classes} from '../../helper/utils'

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
  connectedUser?: LayoutConnectedUser
}

export const ScMenuBtn = ({connectedUser}: Props) => {
  const css = useMenuStyles()
  const openMenu = useBoolean()

  return (
    <div className={css.root}>
      <Avatar className={classes(css.avatar, !connectedUser && css.avatarOffline)} onClick={openMenu.toggle}>
        <Icon>{connectedUser ? 'person' : 'no_accounts'}</Icon>
      </Avatar>
      {connectedUser && openMenu.value && (
        <ScMenu onClose={openMenu.setFalse} connectedUser={connectedUser}/>
      )}
    </div>
  )
}



