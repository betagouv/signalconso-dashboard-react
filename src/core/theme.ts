import { SxProps, Theme } from '@mui/material'
import createTheme from '@mui/material/styles/createTheme'
import { ThemeOptions } from '@mui/material/styles/createTheme'
import { colorBlueFrance } from 'alexlibs/mui-extension/color'
import { makeSx } from '../alexlibs/mui-extension'

export const combineSx = (
  ...sxs: (SxProps<Theme> | undefined | false)[]
): SxProps<Theme> => {
  return sxs.reduce(
    (res, sx) => (sx !== undefined && sx !== false ? { ...res, ...sx } : res),
    {} as any,
  )
}

export const sxUtils = makeSx({
  fontBig: {
    fontSize: (t) => t.typography.fontSize * 1.15,
  },
  fontNormal: {
    fontSize: (t) => t.typography.fontSize,
  },
  tdActions: {
    textAlign: 'right',
  },
  truncate: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  inlineIcon: {
    display: 'inline !important',
    fontSize: 'inherit',
    lineHeight: 1,
    verticalAlign: 'text-top',
  },
})

export const styleUtils = (t: Theme) => ({
  fontSize: {
    big: t.typography.fontSize * 1.15,
    normal: t.typography.fontSize,
    small: t.typography.fontSize * 0.85,
    title: t.typography.fontSize * 1.3,
    bigTitle: t.typography.fontSize * 1.6,
  },
  color: {
    success: '#00b79f',
    error: '#cf0040',
    warning: '#FFB900',
    info: '#0288d1',
  },
  truncate: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  } as any,
})

const defaultSpacing = 8

export const muiTheme = (): Theme => {
  const baseTheme = createTheme({
    spacing: defaultSpacing,
    palette: {
      primary: {
        main: colorBlueFrance,
      },
      mode: 'light',
    },
    typography: {
      fontFamily: 'Marianne, "Open Sans", sans-serif',
    },
  })
  const theme: ThemeOptions = {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            paddingTop: 0,
            paddingBottom: 0,
            minHeight: 50,
            height: 50,
            paddingRight: 8,
            paddingLeft: 8,
          },
          head: {
            lineHeight: 1.2,
          },
          sizeSmall: {
            height: 40,
            minHeight: 40,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: baseTheme.typography.fontSize,
          },
        },
      },
    },
  }
  return createTheme({
    ...baseTheme,
    ...theme,
  })
}
