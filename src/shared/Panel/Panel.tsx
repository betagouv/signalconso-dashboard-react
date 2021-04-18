import * as React from 'react'
import {ReactNode} from 'react'
import {createStyles, LinearProgress, makeStyles, Theme} from '@material-ui/core'
import {classes} from '../../core/helper/utils'

const useStyles = makeStyles((t: Theme) => createStyles({
  root: {
    borderRadius: 4,
    marginBottom: t.spacing(2),
    border: `1px solid ${t.palette.divider}`
  },
  loader: {
  },
  hover: {
    cursor: 'pointer',
    transition: t.transitions.create('all'),
    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: t.shadows[4],
    }
  }
}));

export interface PanelProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  loading?: boolean
  hoverable?: boolean
  children?: ReactNode
  className?: string
}

export const Panel = ({className, hoverable, loading, children, ...other}: PanelProps) => {
  const css = useStyles();
  return (
    <div className={classes(css.root, hoverable && css.hover, className)} {...other}>
      {children}
      {loading && <LinearProgress className={css.loader}/>}
    </div>
  );
};
