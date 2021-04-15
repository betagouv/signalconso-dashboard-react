import * as React from 'react';
import {ReactNode} from 'react';
import {CardContent as MuiCardContent, Theme} from '@material-ui/core';
import classNames from 'classnames';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles((t: Theme) => ({
  root: {
    borderRadius: 2,
    padding: `${t.spacing(1)}px ${t.spacing(2)}px !important`,
    // padding: '0 !important',
    // margin: t.spacing(1),
    // margin: padding(),
  }
}));

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: any;
  children: ReactNode;
}

export const PanelContent = ({className, children, ...other}: Props) => {
  const classes = useStyles();
  return (
    <MuiCardContent {...other} className={classNames(classes.root, className)}>
      {children}
    </MuiCardContent>
  );
};
