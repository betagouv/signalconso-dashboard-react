import React, {ReactNode} from 'react'
import {Box, Divider, Icon, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {classes} from '../../core/helper/utils'

interface SubscriptionCardRowProps {
  icon: string
  label: string
  children: ReactNode
  onClick?: any
}

export const SubscriptionCardRow = ({icon, label, children, onClick}: SubscriptionCardRowProps) => {
  return (
    <>
      <Box sx={{
        cursor: 'pointer',
        py: 1.5,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        transition: t => t.transitions.create('background'),
        '&:hover': {
          background: t => t.palette.action.hover,
        },
      }} onClick={onClick}>
        <Icon sx={{
          color: t => t.palette.text.secondary,
          my: .5,
          mr: 2,
          ml: 3,
        }}>
          {icon}
        </Icon>
        <Box sx={{minWidth: 110,}}>
          <Txt color="hint">{label}</Txt>
        </Box>
        <Box sx={{flex: 1}}>{children}</Box>
        <Icon sx={{mr: 1, color: t => t.palette.text.disabled}}>chevron_right</Icon>
      </Box>
      <Divider sx={{
        ml: 3,
        '&:last-of-type': {
          display: 'none',
        },
      }} />
    </>
  )
}
