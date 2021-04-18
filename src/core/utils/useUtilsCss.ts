import {Theme} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

export const useUtilsCss = makeStyles((t: Theme) => ({
  txtBold: {
    fontWeight: t.typography.fontWeightBold ?? 'bold',
  }
}))
