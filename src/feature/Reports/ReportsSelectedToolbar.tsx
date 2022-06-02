import {lighten} from '@mui/system/colorManipulator'
import {ScButton} from '../../shared/Button/Button'
import {Box} from '@mui/material'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {Id} from '@signal-conso/signalconso-api-sdk-js'
import {useReportContext} from '../../core/context/ReportContext'

export const ReportsSelectedToolbar = ({
  ids,
}: {
  ids: Id[]
}) => {
  const _report = useReportContext()
  const {m} = useI18n()
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      pr: 2,
      pl: 2,
      zIndex: 2,
      overflow: 'hidden',
      transition: t => t.transitions.create('all'),
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      opacity: ids.length > 0 ? 1 : 0,
      height: ids.length > 0 ? 'calc(100% + 2px)' : 0,
      background: t => lighten(t.palette.primary.main, .85),
      borderTopRightRadius: t => t.shape.borderRadius,
      borderTopLeftRadius: t => t.shape.borderRadius,
      margin: `-1px`,
      border: t => `2px solid ${t.palette.primary.main}`,
    }}>
      <span dangerouslySetInnerHTML={{__html: m.nSelected(ids.length)}} />
      <ScButton
        loading={_report.download.loading}
        variant="contained"
        icon="file_download"
        onClick={() => {
          _report.download.fetch({}, ids)
        }}
        sx={{
          marginLeft: 'auto',
        }}
      >
        {m.download}
      </ScButton>
    </Box>
  )
}