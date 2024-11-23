import React from 'react'
import { Box, Icon } from '@mui/material'
import { makeSx } from '../../../alexlibs/mui-extension'
import { styleUtils } from '../../../core/theme'
import { reportFileConfig } from './reportFileConfig'

const css = makeSx({
  root: {
    border: (t) => '1px solid ' + t.palette.text.disabled,
    my: 1,
    borderRadius: '0',
    height: reportFileConfig.cardSize,
    width: reportFileConfig.cardSize,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally and vertically,
    position: 'relative',
    '&:hover': {
      boxShadow: (t) => t.shadows[4],
    },
  },
  body: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  icon: {
    fontSize: 32,
    color: (t) => t.palette.text.disabled,
  },
  label: {
    fontSize: (t) => styleUtils(t).fontSize.normal,
    textTransform: 'initial',
    fontWeight: 'normal',
    lineHeight: 1.4,
    marginTop: 1,
  },
})

export const ReportFileUnavailable = () => {
  return (
    <Box sx={css.root}>
      <Box sx={css.body}>
        <Icon sx={css.icon}>access_time</Icon>
        <Box sx={css.label}>Fichier bientôt disponible</Box>
      </Box>
    </Box>
  )
}
