import * as React from 'react';
import {ReactNode} from 'react';
import {Theme} from '@material-ui/core';
import classNames from 'classnames';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles((t: Theme) => ({
  root: {
    paddingTop: t.spacing(1/2),
    paddingBottom: t.spacing(1/2),
    borderTop: '1px solid ' + t.palette.divider,
  },
}));

interface IProps {
  children?: ReactNode
  className?: string
}

export const SidebarFooter = ({children, className}: IProps) => {
  // @ts-ignore
  const classes = useStyles();
  return (
    <footer className={classNames(classes.root, className)}>
      {children}
    </footer>
  );
};
