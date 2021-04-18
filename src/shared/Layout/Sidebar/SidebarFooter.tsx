import * as React from 'react'
import {ReactNode} from 'react'
import {makeStyles, Theme} from '@material-ui/core'
import {classes} from '../../../core/helper/utils'

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
  const css = useStyles();
  return (
    <footer className={classes(css.root, className)}>
      {children}
    </footer>
  );
};
