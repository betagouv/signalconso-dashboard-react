import {Avatar, Icon, Theme} from '@material-ui/core'
import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {lightBlue} from '@material-ui/core/colors'
import {utilsStyles} from '../../theme'
import {useBoolean} from '@alexandreannic/react-hooks-lib/lib'
import {Menu} from './Menu'
import {LayoutConnectedUser} from '../Layout'

const useMenuStyles = makeStyles((t: Theme) => ({
  root: {
    position: 'relative',
  },
  avatar: {
    color: lightBlue[50],
    backgroundColor: lightBlue[500],
    margin: t.spacing(0, 1),
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

export const MenuBtn = ({connectedUser}: Props) => {
  const css = useMenuStyles()
  const openMenu = useBoolean()

  return (
    <div className={css.root}>
      <Avatar className={css.avatar} onClick={openMenu.toggle}>
        <Icon>{connectedUser ? 'person' : 'no_accounts'}</Icon>
      </Avatar>
      {connectedUser && openMenu.value && (
        <Menu onClose={openMenu.setFalse} connectedUser={connectedUser}/>
      )}
    </div>
  )
}



