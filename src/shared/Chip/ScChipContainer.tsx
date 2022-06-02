import React, {ReactNode} from 'react'
import {Box, Theme} from '@mui/material'

import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'

interface ScChipContainer {
  children: ReactNode
}

export const ScChipContainer = ({children}: ScChipContainer) => {
  return <Box sx={{
    m: -1/2,
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      m: 1 / 2,
    },
  }}>{children}</Box>
}
