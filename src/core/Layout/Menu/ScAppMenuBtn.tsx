import {Box, Icon, Theme} from '@mui/material'
import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import {styleUtils} from '../../theme'
import {useBoolean} from '@alexandreannic/react-hooks-lib/lib'
import {ScAppMenu} from './ScAppMenu'
import {LayoutConnectedUser} from '../Layout'
import {useHistory} from 'react-router'
import {useI18n} from '../../i18n'
import {classes} from '../../helper/utils'
import {IconBtn} from 'mui-extension/lib'
import {siteMap} from '../../siteMap'

const useMenuStyles = makeStyles((t: Theme) => ({
  btn: {
    textTransform: 'initial',
  },
  avatar: {
    transition: t.transitions.create('all'),
    height: 46,
    width: 46,
    // transition: t.transitions.create('all'),
    color: t.palette.secondary.contrastText + ' !important',
    backgroundColor: t.palette.secondary.main + ' !important',
    // backgroundColor: lightBlue[500] + ' !important',
    boxShadow: t.shadows[3],
    margin: t.spacing(0, 1),
    marginRight: 0,
  },
  avatarOffline: {
    boxShadow: 'none',
    opacity: .4,
    // color: grey[50],
    // backgroundColor: grey[500],
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
  const {m} = useI18n()

  return (
    <Box sx={{position: 'relative'}}>
      {/*<ScButton*/}
      {/*  variant="contained"*/}
      {/*  color="secondary"*/}
      {/*  iconAfter="arrow_drop_down"*/}
      {/*  className={css.btn}*/}
      {/*  disabled={!connectedUser}*/}
      {/*  sx={{display: 'flex', alignItems: 'center'}}*/}
      {/*  onClick={() => {*/}
      {/*    if (connectedUser) openMenu.toggle()*/}
      {/*    else history.push(siteMap.loggedout.login)*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Icon sx={{opacity: .7, mr: 1}}>menu</Icon>*/}
      {/*  {m.menu}*/}
      {/*</ScButton>*/}
      <Box sx={{position: 'relative'}}>
        <Box sx={{display: 'flex', alignItems: 'center'}} onClick={() => {
          if (connectedUser) openMenu.toggle()
          else history.push(siteMap.loggedout.login)
        }}>
          <IconBtn
            size="large"
            disabled={!connectedUser}
            className={classes(css.avatar, !connectedUser && css.avatarOffline)}
          >
            <Icon fontSize="large">{connectedUser ? 'person' : 'no_accounts'}</Icon>
          </IconBtn>
          <Icon sx={connectedUser ? {} : {visibility: 'hidden'}}>arrow_drop_down</Icon>
        </Box>
      </Box>
      {connectedUser && openMenu.value && <ScAppMenu onClose={openMenu.setFalse} connectedUser={connectedUser} />}
    </Box>
  )
}
