import {ReactNode} from 'react'
import {Box, Theme} from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

interface Props {
  children: ReactNode
}

export const widgetBodyHeight = 44

export const WidgetBody = ({children}: Props) => {
  return <Box sx={{
    height: widgetBodyHeight,
    display: 'flex',
    alignItems: 'center',
  }}>{children}</Box>
}
