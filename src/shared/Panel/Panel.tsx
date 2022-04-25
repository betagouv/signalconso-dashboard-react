import * as React from 'react'
import {forwardRef, ReactNode} from 'react'
import {Card, LinearProgress, Skeleton, Stack, Theme} from '@mui/material'
import {classes} from '../../core/helper/utils'
import {CardProps} from '@mui/material'
import {makeStyles, createStyles} from '@mui/styles'

const useStyles = makeStyles((t: Theme) =>
  createStyles({
    root: {
      borderRadius: 6,
      marginBottom: t.spacing(2),
    },
    border: {
      border: `1px solid ${t.palette.divider}`,
    },
    loader: {
      marginBottom: -4,
    },
    align: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
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
      height: `calc(100% - ${t.spacing(2)})`,
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

export const Panel = forwardRef(
  ({className, elevation = 0, hoverable, loading, children, stretch, ...other}: PanelProps, ref: any) => {
    const css = useStyles()
    return (
      <Card
        ref={ref}
        elevation={elevation}
        className={classes(css.root, hoverable && css.hover, stretch && css.stretch, className, elevation === 0 && css.border)}
        {...other}
      >
        {loading && <LinearProgress className={css.loader} />}
        {loading ? (
          <Stack sx={{marginTop: '20px', marginBottom: '20px'}}>
            <Skeleton variant={'text'} className={css.align} width={'90%'} />
            <Skeleton variant={'text'} className={css.align} width={'90%'} />
            <Skeleton variant={'text'} className={css.align} width={'90%'} />
            <Skeleton variant={'text'} className={css.align} width={'90%'} />
          </Stack>
        ) : (
          children
        )}
      </Card>
    )
  },
)
