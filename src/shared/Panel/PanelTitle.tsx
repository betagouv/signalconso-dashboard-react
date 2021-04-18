import * as React from 'react'
import {ReactNode} from 'react'
import {makeStyles, Theme} from '@material-ui/core'
import {theme} from '../../core/theme'
import {classes} from '../../core/helper/utils'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    fontWeight: t.typography.fontWeightMedium,
    margin: theme.padding(t.spacing(2), t.spacing(2)),
    fontSize: theme.fontSize.title
  }
}));

interface Props {
  className?: any;
  children: ReactNode;
}

export const PanelTitle = ({ className, children, ...other }: Props) => {
  const css = useStyles();
  return (
    <h3 {...other} className={classes(css.root, className)}>
      {children}
    </h3>
  );
};
