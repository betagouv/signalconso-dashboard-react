import * as React from 'react'
import {makeStyles, Theme} from '@material-ui/core'
import {classes} from '../../../core/helper/utils'

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
  const css = useStyles();
  return (
    <div className={classes(css.root, className, margin && css.rootMargin)}/>
  );
};
