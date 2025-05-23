import { CardContentProps, CardContent as MuiCardContent } from '@mui/material'

type PanelBodyProps = CardContentProps

export const PanelBody = ({ sx, children, ...other }: PanelBodyProps) => {
  return (
    <MuiCardContent
      {...other}
      sx={{
        borderRadius: '2px',
        p: 2,
        m: 0,
        '&:last-child': {
          pb: 2,
        },
        ...sx,
      }}
    >
      {children}
    </MuiCardContent>
  )
}
