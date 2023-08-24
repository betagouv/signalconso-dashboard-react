import {Box, BoxProps} from '@mui/material'
import {ReportResponseTypes} from '../core/client/event/Event'
import React from 'react'
import {useI18n} from '../core/i18n'
import {fnSwitch} from '../core/helper'

interface ProResponseLabelProps extends BoxProps {
  proResponse: ReportResponseTypes
}

export const ProResponseLabel = React.forwardRef(({proResponse, ...other}: ProResponseLabelProps, ref: any) => {
  const {m} = useI18n()
  return (
    <>
      {fnSwitch(proResponse, {
        [ReportResponseTypes.Accepted]: _ => (
          <Box
            component="span"
            sx={{
              pl: '8px',
              pr: '8px',
              borderRadius: '240px',
              background: t => t.palette.success.light,
              color: 'white',
            }}
            ref={ref}
            {...other}
          >
            {m.reportResponseShort[_]}
          </Box>
        ),
        [ReportResponseTypes.NotConcerned]: _ => (
          <Box
            component="span"
            sx={{
              pl: '8px',
              pr: '8px',
              borderRadius: '240px',
              background: t => t.palette.info.light,
              color: 'white',
            }}
            ref={ref}
            {...other}
          >
            {m.reportResponseShort[_]}
          </Box>
        ),
        [ReportResponseTypes.Rejected]: _ => (
          <Box
            component="span"
            sx={{
              pl: '8px',
              pr: '8px',
              borderRadius: '240px',
              background: t => t.palette.error.light,
              color: 'white',
            }}
            ref={ref}
            {...other}
          >
            {m.reportResponseShort[_]}
          </Box>
        ),
      })}
    </>
  )
})
