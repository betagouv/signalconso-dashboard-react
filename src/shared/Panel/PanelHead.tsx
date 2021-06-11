import * as React from 'react'
import {ReactNode} from 'react'
import {makeStyles, Theme} from '@material-ui/core'
import {utilsStyles} from '../../core/theme'
import {classes} from '../../core/helper/utils'
import {PanelTitle} from './PanelTitle'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    padding: utilsStyles(t).spacing(2, 2, 0, 2),
    margin: 0,
  }
}));

interface Props {
  className?: any;
  children: ReactNode;
}

export const PanelHead = ({ className, children, ...other }: Props) => {
  const css = useStyles();
  return (
    <PanelTitle {...other} className={classes(css.root, className)}>
      {children}
    </PanelTitle>
  );
};
