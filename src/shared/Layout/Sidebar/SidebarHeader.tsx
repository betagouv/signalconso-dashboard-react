import * as React from 'react';
import {ReactNode} from 'react';
import {Theme} from '@material-ui/core';
import classNames from 'classnames';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles((t: Theme) => ({
  root: {
    paddingTop: t.spacing(1/2),
    paddingBottom: t.spacing(1/2),
  },
}));

interface IProps {
  className?: string
  children?: ReactNode
}

export const SidebarHeader = ({className, children}: IProps) => {
  // @ts-ignore
  const classes = useStyles();
  return (
    <header className={classNames(classes.root, className)}>
      {children}
    </header>
  );
};
