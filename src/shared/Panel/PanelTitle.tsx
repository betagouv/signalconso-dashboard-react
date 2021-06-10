import {makeStyles, Theme} from '@material-ui/core'
import {utilsStyles} from '../../core/theme'
import {classes} from '../../core/helper/utils'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    fontWeight: t.typography.fontWeightMedium,
    margin: utilsStyles(t).spacing(0, 0, 2, 0),
    fontSize: utilsStyles(t).fontSize.title,
  }
}))

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
}

export const PanelTitle = ({className, ...props}: Props) => {
  const css = useStyles()
  return (
    <h3 {...props} className={classes(css.root, className)}/>
  )
}
