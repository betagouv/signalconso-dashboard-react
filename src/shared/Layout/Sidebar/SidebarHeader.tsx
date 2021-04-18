import * as React from 'react'
import {ReactNode} from 'react'
import {makeStyles, Theme} from '@material-ui/core'
import {classes} from '../../../core/helper/utils'

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
  const css = useStyles();
  return (
    <header className={classes(css.root, className)}>
      {children}
    </header>
  );
};
