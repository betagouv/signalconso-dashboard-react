import {red} from '@material-ui/core/colors'
import {createTheme, fade, Theme} from '@material-ui/core'

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
  const theme = createTheme()
  const colorMain = '#407e99'
  const colorMainLight = '#6697ad'
  const colorMainDark = '#2c586b'
  return createTheme({
    palette: {
      primary: {
        light: colorMainLight,
        main: colorMain,
        dark: colorMainDark,
      },
      secondary: {
        light: colorMainLight,
        main: colorMain,
        dark: colorMainDark,
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
      MuiChip: {
        outlined: {
          borderColor: theme.palette.divider,
        }
      },
      MuiMenuItem: {
        root: {
          fontSize: '1rem',
          minHeight: 42,
          [theme.breakpoints.up('xs')]: {
            minHeight: 42,
          }
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
      MuiOutlinedInput: {
        root: {
          '&:hover $notchedOutline': {
            borderColor: fade(colorMain, .7),
          },
        },
        notchedOutline: {
          transition: 'border-color 140ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          background: 'rgba(0,0,0,.028)',
          borderColor: 'rgba(0, 0, 0, 0.12)'
        }
      }
    },
  })
}
