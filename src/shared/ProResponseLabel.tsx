import { Box, BoxProps } from '@mui/material'
import React, { Ref } from 'react'
import { ReportResponseTypes } from '../core/client/event/Event'
import { fnSwitch } from '../core/helper'
import { useI18n } from '../core/i18n'
import { Label } from './Label'
import { reportStatusColor } from './reportStatusUtils'
import { ReportStatus } from '../core/client/report/Report'

interface ProResponseLabelProps extends BoxProps {
  proResponse: ReportResponseTypes
}

export const ProResponseLabel = React.forwardRef(
  ({ proResponse, ...other }: ProResponseLabelProps, ref: Ref<unknown>) => {
    const { m } = useI18n()
    return (
      <>
        {fnSwitch(proResponse, {
          [ReportResponseTypes.Accepted]: (_) => (
            <Label
              style={{
                color: 'white',
                background: reportStatusColor[ReportStatus.PromesseAction],
                borderRadius: '10px',
              }}
              dense
              ref={ref}
              {...other}
            >
              {m.reportResponseShort[_]}
            </Label>
          ),
          [ReportResponseTypes.NotConcerned]: (_) => (
            <Label
              style={{
                color: 'white',
                background: reportStatusColor[ReportStatus.MalAttribue],
                borderRadius: '10px',
              }}
              dense
              ref={ref}
              {...other}
            >
              {m.reportResponseShort[_]}
            </Label>
          ),
          [ReportResponseTypes.Rejected]: (_) => (
            <Label
              style={{
                color: 'white',
                background: reportStatusColor[ReportStatus.Infonde],
                borderRadius: '10px',
              }}
              dense
              ref={ref}
              {...other}
            >
              {m.reportResponseShort[_]}
            </Label>
          ),
        })}
      </>
    )
  },
)
