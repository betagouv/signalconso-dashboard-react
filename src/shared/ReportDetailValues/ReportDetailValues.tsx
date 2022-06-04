import {DetailInputValue} from '@signal-conso/signalconso-api-sdk-js'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import * as React from 'react'
import {CSSProperties} from 'react'
import {Box, BoxProps, Theme, Tooltip} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {useMemoFn} from '../hooks/UseMemoFn'

interface Props extends BoxProps {
  input: DetailInputValue[]
  lines?: number
  hideTooltip?: boolean
}

export const ReportDetailValues = ({input, lines = 2, hideTooltip, sx, ...props}: Props) => {
  const cssUtils = useCssUtils()
  const description = useMemoFn(input, _ => _.find(_ => _.label === 'Description :')?.value)

  return (
    <Tooltip
      hidden={hideTooltip}
      title={input.map((detail, i) => (
        <div key={i}>
          <span dangerouslySetInnerHTML={{__html: detail.label}} className={cssUtils.txtBold} />
          &nbsp;
          <span dangerouslySetInnerHTML={{__html: detail.value}} className={cssUtils.tooltipColorTxtSecondary} />
        </div>
      ))}
    >
      <Box {...props} sx={{
        ...sx,
        display: '-webkit-box',
        '-webkit-line-clamp': lines,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden'
      }}>
        {description ||
        input.map((_, i) => (
          <span key={i}>
              <Txt bold>{_.label}</Txt> <span dangerouslySetInnerHTML={{__html: _.value}} />
              <br />
            </span>
        ))}
      </Box>
    </Tooltip>
  )
}
