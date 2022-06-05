import {Box, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {ReactNode} from 'react'
import {WidgetBody} from './WidgetBody'

interface Props {
  children: ReactNode
}

export const WidgetValue = ({children}: Props) => {
  return (
    <WidgetBody>
      <Box sx={{
        fontSize: 36,
        lineHeight: 1,
      }}>
        {children}
      </Box>
    </WidgetBody>
  )
}
