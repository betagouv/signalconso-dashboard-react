import { Box, Divider, Icon } from '@mui/material'
import { ReactEventHandler, ReactNode } from 'react'
import { Txt } from '../../alexlibs/mui-extension'

interface SubscriptionCardRowProps {
  icon: string
  label: string
  children: ReactNode
  onClick?: ReactEventHandler<HTMLElement>
}

export const SubscriptionCardRow = ({
  icon,
  label,
  children,
  onClick,
}: SubscriptionCardRowProps) => {
  return (
    <>
      <Box
        sx={{
          cursor: 'pointer',
          py: 0.5,
          px: 0,
          display: 'flex',
          alignItems: 'center',
          transition: (t) => t.transitions.create('background'),
          '&:hover': {
            background: (t) => t.palette.action.hover,
          },
        }}
        onClick={onClick}
      >
        <Icon
          sx={{
            color: (t) => t.palette.text.secondary,
            my: 0.5,
            mr: 2,
          }}
        >
          {icon}
        </Icon>
        <Box sx={{ minWidth: 115 }}>
          <Txt color="hint">{label}</Txt>
        </Box>
        <Box sx={{ flex: 1 }}>{children}</Box>
        <Icon sx={{ color: (t) => t.palette.text.disabled }}>
          chevron_right
        </Icon>
      </Box>
      <Divider
        sx={{
          ml: 3,
          '&:last-of-type': {
            display: 'none',
          },
        }}
      />
    </>
  )
}
