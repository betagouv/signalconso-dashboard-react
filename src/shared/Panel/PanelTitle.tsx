import * as React from 'react'
import {ReactNode} from 'react'
import {makeStyles, Theme} from '@material-ui/core'
import {utilsStyles} from '../../core/theme'
import {classes} from '../../core/helper/utils'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    fontWeight: t.typography.fontWeightMedium,
    padding: utilsStyles(t).spacing(2, 2, 0, 2),
    margin: utilsStyles(t).spacing(0, 0, 0, 0),
    fontSize: utilsStyles(t).fontSize.title,
  }
}));

interface Props {
  className?: any;
  children: ReactNode;
}

export const PanelTitle = ({ className, children, ...other }: Props) => {
  const css = useStyles();
  return (
    <h3 {...other} className={classes(css.root, className)}>
      {children}
    </h3>
  );
};
