import {ReactNode} from 'react'
import {makeStyles, Theme} from '@material-ui/core'

interface Props {
  children: ReactNode
}

export const widgetBodyHeight = 44

const useStyles = makeStyles((t: Theme) => ({
  root: {
    height: widgetBodyHeight,
    display: 'flex',
    alignItems: 'center',
  },
}))

export const WidgetBody = ({children}: Props) => {
  const css = useStyles()
  return (
    <div className={css.root}>{children}</div>
  )
}
