import React, {ReactNode} from 'react'
import {Box} from '@mui/material'

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
