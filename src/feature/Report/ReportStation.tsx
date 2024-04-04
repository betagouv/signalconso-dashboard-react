import {Box, Icon, useTheme} from '@mui/material'

export function ReportStation({station}: {station: string}) {
  const theme = useTheme()
  return (
    <Box sx={{mt: theme.spacing(4), display: 'inline-flex', alignItems: 'center'}}>
      <Icon
        sx={{
          fontSize: 20,
          mr: 0.5,
        }}
      >
        subway
      </Icon>
      Gare concernée : {station}
    </Box>
  )
}
