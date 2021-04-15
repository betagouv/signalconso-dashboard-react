import * as React from 'react';
import {ReactNode} from 'react';
import {makeStyles} from '@material-ui/core';
import {Theme, Typography} from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles((t: Theme) => ({
  root: {
    marginTop: t.spacing(1),
    marginBottom: t.spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
  action: {
    marginLeft: 'auto',
  }
}));

interface Props {
  children?: ReactNode
  action?: ReactNode
  className?: string
}

export const PageTitle = ({className, action, children, ...props}: Props) => {
  const css = useStyles();
  return (
    <Typography variant="h5" className={classNames(css.root, className)} {...props}>
      {children}
      {action && <div className={css.action}>{action}</div>}
    </Typography>
  );
};
