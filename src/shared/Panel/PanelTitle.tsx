import * as React from 'react';
import {ReactNode} from 'react';
import {Theme} from '@material-ui/core';
import classNames from 'classnames';
import {makeStyles} from '@material-ui/core';
import {theme} from '../../core/theme';

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
  const classes = useStyles();
  return (
    <h3 {...other} className={classNames(classes.root, className)}>
      {children}
    </h3>
  );
};
