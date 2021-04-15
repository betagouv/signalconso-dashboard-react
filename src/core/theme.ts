import {blue, red} from '@material-ui/core/colors';
import {fade, Theme} from '@material-ui/core'

export const theme = {
  defaultRadius: 4,
  gridSpacing: 3 as any,
  fontSize: {
    big: '1.15rem',
    normal: '1rem',
    small: '0.85rem',
    title: '1.30rem'
  },
  padding: (...args: number[]) => args.length === 0 ? `8px 8px 8px 16px` : args.map(a => a + 'px').join(' '),
  color: {
    hoverBackground: (t: Theme) => fade(t.palette.divider, .03),
    success: '#00c616',
    error: '#cf0040',
    warning: '#FFB900',
    info: '#0288d1',
    toolbar: (t: Theme) => t.palette.type === 'light' ? t.palette.grey[100] : t.palette.grey[900]
  },
  mixins: {
    truncate: {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    } as any
  },
};

const Tab = {
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
  MuiIcon: {
    root: {
      width: 'auto',
    }
  },
  MuiIconButton: {
    root: {
      padding: 6,
    }
  },
};

export const muiTheme = (): any => ({
  palette: {
    primary: blue,
    secondary: blue,
    error: red,
    type: 'light'
  },
  typography: {
    fontSize: 15,
    // fontFamily: '"Open Sans", sans-serif',
  },
  overrides: {
    ...Tab,
  },
});
