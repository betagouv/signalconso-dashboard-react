import * as React from 'react'
import {ReactNode} from 'react'
import {Card, createStyles, LinearProgress, makeStyles, Theme} from '@material-ui/core'
import {classes} from '../../core/helper/utils'
import {CardProps} from '@material-ui/core/Card/Card'

const useStyles = makeStyles((t: Theme) =>
  createStyles({
    root: {
      borderRadius: 4,
      marginBottom: t.spacing(3),
    },
    border: {
      border: `1px solid ${t.palette.divider}`,
    },
    loader: {},
    hover: {
      cursor: 'pointer',
      transition: t.transitions.create('all'),
      '&:hover': {
        transform: 'scale(1.01)',
        boxShadow: t.shadows[4],
      },
    },
    stretch: {
      display: 'flex',
      flexDirection: 'column',
      height: `calc(100% - ${t.spacing(2)}px)`,
    },
  }),
)

export interface PanelProps extends CardProps {
  loading?: boolean
  hoverable?: boolean
  children?: ReactNode
  className?: string
  stretch?: boolean
  elevation?: number
}

export const Panel = ({className, elevation = 0, hoverable, loading, children, stretch, ...other}: PanelProps) => {
  const css = useStyles()
  return (
    <Card
      elevation={elevation}
      className={classes(css.root, hoverable && css.hover, stretch && css.stretch, className, elevation === 0 && css.border)}
      {...other}
    >
      {children}
      {loading && <LinearProgress className={css.loader} />}
    </Card>
  )
}
