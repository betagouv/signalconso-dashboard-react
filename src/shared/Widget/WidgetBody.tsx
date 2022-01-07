import {ReactNode} from 'react'
import { Theme } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

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
  return <div className={css.root}>{children}</div>
}
