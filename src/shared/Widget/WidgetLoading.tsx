import * as React from 'react'
import {makeStyles, Theme} from '@material-ui/core'
import {widgetBodyHeight} from './WidgetBody'
import {Skeleton} from '@material-ui/lab'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: widgetBodyHeight,
  },
}))
export const WidgetLoading = () => {
  const css = useStyles()
  return (
    <div className={css.root}>
      <Skeleton height={46} width="60%" />
    </div>
  )
}
