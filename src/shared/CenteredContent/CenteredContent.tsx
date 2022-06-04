import {ReactNode, useMemo} from 'react'
import makeStyles from '@mui/styles/makeStyles'
import {Box, Theme} from '@mui/material'

interface Props {
  children: ReactNode
  offset?: number
}

export const CenteredContent = ({children, offset = 0}: Props) => {
  return (
    <Box sx={{
      root: {
        minHeight: `calc(100vh - ${offset}px)`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        '&:before, &:after': {
          content: '" "',
          display: 'block',
          flexGrow: 1,
          height: 24
        }
      }
    }}>
      {children}
    </Box>
  )
}
