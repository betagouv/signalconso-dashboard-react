import {Box, Icon, Theme} from '@mui/material'
import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import {styleUtils, sxUtils} from '../../theme'
import {useBoolean} from '@alexandreannic/react-hooks-lib/lib'
import {ScAppMenu} from './ScAppMenu'
import {LayoutConnectedUser} from '../Layout'
import {useHistory} from 'react-router'
import {useI18n} from '../../i18n'
import {classes} from '../../helper/utils'
import {IconBtn} from 'mui-extension/lib'
import {siteMap} from '../../siteMap'
import {makeSx} from 'mui-extension'

interface Props {
  connectedUser?: LayoutConnectedUser
}

export const ScAppMenuBtn = ({connectedUser}: Props) => {
  const openMenu = useBoolean(false)
  const history = useHistory()

  return (
    <Box sx={{position: 'relative'}}>
      <Box sx={{position: 'relative'}}>
        <Box sx={{display: 'flex', alignItems: 'center'}} onClick={() => {
          if (connectedUser) openMenu.toggle()
          else history.push(siteMap.loggedout.login)
        }}>
          <IconBtn
            size="large"
            disabled={!connectedUser}
            sx={{
              transition: t => t.transitions.create('all'),
              height: 46,
              width: 46,
              color: t => t.palette.secondary.contrastText + ' !important',
              backgroundColor: t => t.palette.secondary.main + ' !important',
              // backgroundColor: lightBlue[500] + ' !important',
              boxShadow: t => t.shadows[3],
              my: 0,
              mx: 1,
              mr: 0,
              ...(!connectedUser && {
                boxShadow: 'none',
                opacity: .4,
              }),
            }}
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
