import { Txt } from '../../../alexlibs/mui-extension'
import React from 'react'
import { Box } from '@mui/material'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material/styles'

interface ReportAnswerProItemProps {
  title?: string
  desc?: string
  children?: any
  sx?: SxProps<Theme>
}

export const ReportResponseFormItem = ({
  children,
  title,
  desc,
  sx,
}: ReportAnswerProItemProps) => {
  return (
    <Box sx={{ ...sx, mb: 2 }}>
      {title && (
        <Txt block size="big" bold>
          {title}
        </Txt>
      )}
      {desc && (
        <Txt color="hint">
          <span dangerouslySetInnerHTML={{ __html: desc }} />
        </Txt>
      )}
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  )
}
