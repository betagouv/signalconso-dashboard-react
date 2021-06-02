import {Theme} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

export const useUtilsCss = makeStyles((t: Theme) => {
  return {
    txtBig: {
      fontSize: t.typography.fontSize * 1.125,
    },
    txtSmall: {
      fontSize: t.typography.fontSize * 0.875,
    },
    txtBold: {
      fontWeight: t.typography.fontWeightBold ?? 'bold',
    },
    colorTxtSecondary: {
      color: t.palette.text.secondary + ' !important',
    },
    colorError: {
      color: t.palette.error.main,
    },
    colorTxtHint: {
      color: t.palette.text.hint + ' !important',
    },
    colorDisabled: {
      color: t.palette.text.disabled + ' !important',
    },
    colorPrimary: {
      color: t.palette.primary.main + ' !important',
    },
    truncate: {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    divider: {
      marginTop: t.spacing(2),
      marginBottom: t.spacing(2),
    },
    inlineIcon: {
      display: 'inline !important',
      fontSize: 'initial',
      verticalAlign: 'text-top',
    },
    txtRight: {
      textAlign: 'right',
    },
    marginTop: {
      marginTop: t.spacing(1),
    },
    marginBottom: {
      marginBottom: t.spacing(1),
    },
    marginRight: {
      marginRight: t.spacing(1),
    },
    marginLeft: {
      marginLeft: t.spacing(1),
    },
    paddingTop: {
      paddingTop: t.spacing(1),
    },
    paddingBottom: {
      paddingBottom: t.spacing(1),
    },
    paddingRight: {
      paddingRight: t.spacing(1),
    },
    paddingLeft: {
      paddingLeft: t.spacing(1),
    },
    marginLeftAuto: {
      marginLeft: 'auto',
    },
    fullWidth: {
      width: '100%',
    },
    nowrap: {
      whiteSpace: 'nowrap',
    }
  }
})
