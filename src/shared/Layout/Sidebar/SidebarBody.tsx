import * as React from 'react'
import {ReactNode} from 'react'
import {makeStyles, Theme} from '@material-ui/core'
import {classes} from '../../../core/helper/utils'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    paddingTop: t.spacing(1/2),
    paddingBottom: t.spacing(1/2),
    flex: 1,
    overflowY: 'auto',
  },
}));

interface IProps {
  children?: ReactNode
  className?: string
}

export const SidebarBody = ({children, className}: IProps) => {
  const css = useStyles();
  return (
    <main className={classes(css.root, className)}>
      {children}
    </main>
  );
};
