import * as React from 'react';
import {ReactNode} from 'react';
import {Slide, Theme} from '@material-ui/core';
import classNames from 'classnames';
import {sidebarWith} from '../Layout';
import makeStyles from '@material-ui/styles/makeStyles';

const useStyles = makeStyles((t: Theme) => ({
  root: {
    paddingTop: t.spacing(2),
    width: sidebarWith,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
    // borderRight: `1px solid ${t.palette.divider}`
  },
}));

interface IProps {
  className?: string
  children?: ReactNode
}

export const Sidebar = ({children, className}: IProps) => {
  // @ts-ignore
  const css = useStyles();

  return (
    <Slide direction="right" in={true} mountOnEnter unmountOnExit>
      <aside className={classNames(css.root, className)}>
        {children}
      </aside>
    </Slide>
  );
};
