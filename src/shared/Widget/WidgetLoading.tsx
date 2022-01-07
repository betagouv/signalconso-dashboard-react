import * as React from 'react'
import {Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {widgetBodyHeight} from './WidgetBody'
import {Skeleton} from '@mui/material'

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
