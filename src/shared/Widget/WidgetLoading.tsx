import * as React from 'react'
import {Box, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {widgetBodyHeight} from './WidgetBody'
import {Skeleton} from '@mui/material'

export const WidgetLoading = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      height: widgetBodyHeight,
    }}>
      <Skeleton height={46} width="60%" />
    </Box>
  )
}
