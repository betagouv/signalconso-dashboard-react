import {Theme} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'

export const useUtilsCss = makeStyles((t: Theme) => ({
  txtBold: {
    fontWeight: t.typography.fontWeightBold ?? 'bold',
  },
  colorTxtSecondary: {
    color: t.palette.text.secondary + ' !important',
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
}))
