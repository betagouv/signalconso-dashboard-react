import React, {ReactNode} from 'react'
import {Box, Icon} from '@mui/material'
import {Txt} from 'mui-extension/lib/Txt/Txt'

interface SubscriptionCardRowProps {
  icon: string
  label: string
  children: ReactNode
  onClick?: any
}

export const SubscriptionCardRow = ({icon, label, children, onClick}: SubscriptionCardRowProps) => {
  return (
    <Box
      sx={{
        mx: 2,
        cursor: 'pointer',
        py: 2,
        px: 0,
        '&:not(:last-of-type)': {
          borderBottom: t => `1px solid ${t.palette.divider}`,
        },
        transition: t => t.transitions.create('background'),
        '&:hover': {
          background: t => t.palette.action.hover,
        },
      }}
      onClick={onClick}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <Icon
          sx={{
            color: t => t.palette.text.secondary,
            mr: 1.5,
          }}
        >
          {icon}
        </Icon>
        <Box sx={{flex: 1}}>
          <Txt color="hint">{label}</Txt>
        </Box>
        <Icon sx={{mr: 1, color: t => t.palette.text.disabled}}>chevron_right</Icon>
      </Box>
      {children && <Box sx={{mt: 1}}>{children}</Box>}
    </Box>
  )
}
