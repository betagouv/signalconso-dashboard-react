import {Box, Icon} from '@mui/material'
import React from 'react'

const ReportCategory = ({children}: {children: any}) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        pb: 0.5,
        border: t => '1px solid ' + t.palette.divider,
        borderRadius: 40,
        py: 0.5,
        px: 1,
      }}
    >
      <Icon
        sx={{
          fontSize: 20,
          // color: t.palette.divider,
          color: t => t.palette.primary.main,
          mr: 0.5,
        }}
      >
        check_circle
      </Icon>
      {children}
    </Box>
  )
}

export interface ReportCategoriesProps {
  categories: any[]
}


