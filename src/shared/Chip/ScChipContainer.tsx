import React, {ReactNode} from 'react'
import {Box} from '@mui/material'

interface ScChipContainer {
  children: ReactNode
}

export const ScChipContainer = ({children}: ScChipContainer) => {
  return (
    <Box
      sx={{
        m: -1 / 4,
        flexWrap: 'wrap',
        display: 'flex',
        '& > *': {
          m: t => t.spacing(1 / 4) + ' !important',
        },
      }}
    >
      {children}
    </Box>
  )
}
