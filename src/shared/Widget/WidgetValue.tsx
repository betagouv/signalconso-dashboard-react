import { Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {ReactNode} from 'react'
import {WidgetBody} from './WidgetBody'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    fontSize: 36,
    lineHeight: 1,
  },
}))

interface Props {
  children: ReactNode
}

export const WidgetValue = ({children}: Props) => {
  const css = useStyles()
  return (
    <WidgetBody>
      <div className={css.root}>{children}</div>
    </WidgetBody>
  )
}
