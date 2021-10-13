import {DetailInputValue} from '@signal-conso/signalconso-api-sdk-js'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import * as React from 'react'
import {CSSProperties} from 'react'
import {makeStyles, Theme, Tooltip} from '@material-ui/core'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {classes} from '../../core/helper/utils'
import {useMemoFn} from '../hooks/UseMemoFn'

interface Props {
  input: DetailInputValue[]
  lines?: number
  hideTooltip?: boolean
  className?: string
  style?: CSSProperties
}

const useStyles = makeStyles((t: Theme) => ({
  desc: (lines: {lines: number}) => ({
    display: '-webkit-box',
    '-webkit-line-clamp': lines.lines,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
  }),
}))
export const ReportDetailValues = ({input, lines = 2, hideTooltip, style, className}: Props) => {
  const cssUtils = useCssUtils()
  const css = useStyles({lines})
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
      <div className={classes(css.desc, className)} style={style}>
        {description ||
          input.map((_, i) => (
            <span key={i}>
              <Txt bold>{_.label}</Txt> <span dangerouslySetInnerHTML={{__html: _.value}} />
              <br />
            </span>
          ))}
      </div>
    </Tooltip>
  )
}
