import React, {ReactNode} from 'react'
import {createStyles, makeStyles, Theme} from '@material-ui/core'

interface ScChipContainer {
  children: ReactNode
}

const useStyles = makeStyles((t: Theme) => createStyles({
  root: {
    margin: t.spacing(-1 / 2),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: t.spacing(1 / 2),
    },
  },
}))

export const ScChipContainer = ({children}: ScChipContainer) => {
  const css = useStyles()
  return (
    <div className={css.root}>{children}</div>
  )

}
