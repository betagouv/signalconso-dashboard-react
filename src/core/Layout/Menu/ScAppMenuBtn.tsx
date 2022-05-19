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
import {ScButton} from '../../../shared/Button/Button'
import {useI18n} from '../../i18n'

const useMenuStyles = makeStyles((t: Theme) => ({
  btn: {
    textTransform: 'initial'
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
      <ScButton
        variant="contained"
        color="secondary"
        iconAfter="arrow_drop_down"
        className={css.btn}
        disabled={!connectedUser}
        sx={{display: 'flex', alignItems: 'center'}}
        onClick={() => {
          if (connectedUser) openMenu.toggle()
          else history.push(siteMap.loggedout.login)
        }}
      >
        <Icon sx={{opacity: .7, mr: 1}}>menu</Icon>
        {m.menu}
      </ScButton>
      {/*<Avatar*/}
      {/*>*/}
      {/*<Icon>{connectedUser ? 'person' : 'no_accounts'}</Icon>*/}
      {/*</Avatar>*/}
      {connectedUser && openMenu.value && <ScAppMenu onClose={openMenu.setFalse} connectedUser={connectedUser} />}
    </Box>
  )
}
