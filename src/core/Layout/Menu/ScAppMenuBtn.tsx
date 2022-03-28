import {Box, Icon, Theme} from '@mui/material'
import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import {grey, lightBlue} from '@mui/material/colors'
import {styleUtils} from '../../theme'
import {useBoolean} from '@alexandreannic/react-hooks-lib/lib'
import {ScAppMenu} from './ScAppMenu'
import {LayoutConnectedUser} from '../Layout'
import {classes} from '../../helper/utils'
import {useHistory} from 'react-router'
import {siteMap} from '../../siteMap'
import {IconBtn} from 'mui-extension/lib'

const useMenuStyles = makeStyles((t: Theme) => ({
  avatar: {
    height: 46,
    width: 46,
    // transition: t.transitions.create('all'),
    color: lightBlue[50],
    backgroundColor: lightBlue[500] + ' !important',
    margin: t.spacing(0, 1),
    marginRight: 0,
  },
  avatarOffline: {
    boxShadow: 'none',
    color: grey[50] + ' !important',
    backgroundColor: grey[500] + ' !important',
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

export const ScAppMenuBtn = ({connectedUser}: Props) => {
  const css = useMenuStyles()
  const openMenu = useBoolean(false)
  const history = useHistory()

  return (
    <Box sx={{position: 'relative'}}>
      <Box sx={{display: 'flex', alignItems: 'center'}} onClick={() => {
        if (connectedUser) openMenu.toggle()
        else history.push(siteMap.loggedout.login)
      }}>
        <IconBtn
          size="large"
          disabled={!connectedUser}
          sx={{
            boxShadow: t => t.shadows[2],
          }}
          className={classes(css.avatar, !connectedUser && css.avatarOffline)}
        >
          <Icon fontSize="large">{connectedUser ? 'menu' : 'no_accounts'}</Icon>
        </IconBtn>
        {connectedUser && (
          <Icon>arrow_drop_down</Icon>
        )}
      </Box>
      {/*<Avatar*/}
      {/*>*/}
      {/*<Icon>{connectedUser ? 'person' : 'no_accounts'}</Icon>*/}
      {/*</Avatar>*/}
      {connectedUser && openMenu.value && <ScAppMenu onClose={openMenu.setFalse} connectedUser={connectedUser} />}
    </Box>
  )
}
