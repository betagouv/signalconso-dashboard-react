import * as React from 'react';
import {Theme} from '@material-ui/core';
import classNames from 'classnames';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles((t: Theme) => ({
  root: {
    height: 1,
    background: t.palette.divider,
    marginRight: t.spacing(1),
    marginLeft: t.spacing(1),
  },
  rootMargin: {
    marginTop: t.spacing(1),
    marginBottom: t.spacing(1),
  }
}));

interface IProps {
  className?: any;
  margin?: boolean;
}

export const SidebarHr = ({className, margin = true}: IProps) => {
  // @ts-ignore
  const classes = useStyles();
  return (
    <div className={classNames(classes.root, className, margin && classes.rootMargin)}/>
  );
};
