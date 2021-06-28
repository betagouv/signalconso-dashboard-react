import {red} from '@material-ui/core/colors'
import {createMuiTheme, Theme} from '@material-ui/core'

export const utilsStyles = (t: Theme) => ({
  defaultRadius: 4,
  gridSpacing: 3 as any,
  fontSize: {
    big: t.typography.fontSize * 1.15,
    normal: t.typography.fontSize,
    small: t.typography.fontSize * 0.85,
    title: t.typography.fontSize * 1.3,
    bigTitle: t.typography.fontSize * 1.6,
  },
  spacing: (...args: number[]) => {
    const [top = 0, right = 0, bottom = 0, left = 0] = args ?? [1, 1, 2, 1]
    return `${t.spacing(top)}px ${t.spacing(right)}px ${t.spacing(bottom)}px ${t.spacing(left)}px`
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

export const muiTheme = (dark?: boolean): any => {
  return createMuiTheme({
    palette: {
      primary: {
        light: '#6697ad',
        main: '#407e99',
        dark: '#2c586b',
      },
      secondary: {
        light: '#6697ad',
        main: '#407e99',
        dark: '#2c586b',
      },
      error: red,
      type: dark ? 'dark' : 'light',
    },
    typography: {
      fontSize: 15,
      // fontFamily: '"Open Sans", sans-serif',
      fontFamily: 'Roboto, sans-serif',
      fontWeightBold: 500,
    },
    overrides: {
      MuiButton: {
        root: {
          borderRadius: 20,
        }
      },
      MuiTabs: {
        root: {
          minHeight: 0,
        }
      },
      MuiTab: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 40,
          minWidth: '80px !important',
        }
      },
      MuiMenuItem: {
        root: {
          fontSize: '1rem',
          minHeight: 42,
        }
      },
      MuiDialogTitle: {
        root: {
          paddingBottom: 8,
        }
      },
      ...(dark && ({
        MuiOutlinedInput: {
          notchedOutline: {
            borderColor: '#d9dce0',
          },
        }
      })),
      MuiTableCell: {
        root: {
          paddingTop: 0,
          paddingBottom: 0,
          minHeight: 50,
          height: 50,
          paddingRight: 8,
          paddingLeft: 8,
        },
      },
      MuiIcon: {
        root: {
          width: 'auto',
        }
      },
      MuiIconButton: {
        root: {
          spacing: 6,
        }
      },
    },
  })
}
