import React, {ReactNode} from 'react'
import {Theme} from '@mui/material'

import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'

interface ScChipContainer {
  children: ReactNode
}

const useStyles = makeStyles((t: Theme) =>
  createStyles({
    root: {
      margin: t.spacing(-1 / 2),
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: t.spacing(1 / 2),
      },
    },
  }),
)

export const ScChipContainer = ({children}: ScChipContainer) => {
  const css = useStyles()
  return <div className={css.root}>{children}</div>
}
