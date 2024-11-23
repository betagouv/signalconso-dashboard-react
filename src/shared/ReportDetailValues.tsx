import { Box, BoxProps, Tooltip } from '@mui/material'
import { Txt } from '../alexlibs/mui-extension'
import { useMemoFn } from '../alexlibs/react-hooks-lib'
import { DetailInputValue } from '../core/client/report/Report'

interface Props extends BoxProps {
  input: DetailInputValue[]
  lines?: number
  hideTooltip?: boolean
}

export const ReportDetailValues = ({
  input,
  lines = 2,
  hideTooltip,
  sx,
  ...props
}: Props) => {
  const description = useMemoFn(
    input,
    (_) => _.find((_) => _.label === 'Description :')?.value,
  )

  return (
    <Tooltip
      hidden={hideTooltip}
      title={input.map((detail, i) => (
        <div key={i}>
          <Box
            component="span"
            sx={{
              fontWeight: (t) => t.typography.fontWeightBold,
              fontSize: '16',
            }}
          >
            {detail.label}
          </Box>
          &nbsp;
          <Box component="span">{detail.value}</Box>
        </div>
      ))}
    >
      <Box
        {...props}
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: lines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          ...sx,
        }}
      >
        {description ||
          input.map((_, i) => (
            <span key={i}>
              <Txt bold>{_.label}</Txt>{' '}
              <span dangerouslySetInnerHTML={{ __html: _.value }} />
              <br />
            </span>
          ))}
      </Box>
    </Tooltip>
  )
}
