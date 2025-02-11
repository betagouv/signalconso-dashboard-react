import { Box, BoxProps } from '@mui/material'
import { styleUtils } from '../../core/theme'

type PanelTitleProps = BoxProps

export const PanelTitle = ({ sx, ...props }: PanelTitleProps) => {
  return (
    <Box
      component="h3"
      {...props}
      sx={{
        fontWeight: (t) => t.typography.fontWeightMedium,
        my: 2,
        mx: 0,
        fontSize: (t) => styleUtils(t).fontSize.title,
        ...sx,
      }}
    />
  )
}
