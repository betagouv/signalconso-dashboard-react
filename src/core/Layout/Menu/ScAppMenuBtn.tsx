import {Box, Icon} from '@mui/material'
import React from 'react'
import {useBoolean} from '@alexandreannic/react-hooks-lib/lib'
import {ScAppMenu} from './ScAppMenu'
import {LayoutConnectedUser} from '../Layout'
import {useHistory} from 'react-router'
import {IconBtn} from 'mui-extension/lib'
import {siteMap} from '../../siteMap'

interface Props {
  connectedUser?: LayoutConnectedUser
}

export const ScAppMenuBtn = ({connectedUser}: Props) => {
  const openMenu = useBoolean(false)
  const history = useHistory()

  return (
    <Box sx={{position: 'relative'}}>
      <Box sx={{position: 'relative'}}>
        <Box
          sx={{display: 'flex', alignItems: 'center'}}
          onClick={() => {
            if (connectedUser) openMenu.toggle()
            else history.push(siteMap.loggedout.login)
          }}
        >
          <IconBtn
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
                opacity: 0.4,
              }),
            }}
          >
            <Icon>{connectedUser ? 'person' : 'no_accounts'}</Icon>
          </IconBtn>
          <Icon sx={connectedUser ? {} : {visibility: 'hidden'}}>arrow_drop_down</Icon>
        </Box>
      </Box>
      {connectedUser && openMenu.value && <ScAppMenu onClose={openMenu.setFalse} connectedUser={connectedUser} />}
    </Box>
  )
}
