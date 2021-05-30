import {PanelHead as MxPanelHeader, PanelHeadProps} from 'mui-extension'
import {makeStyles, Theme} from '@material-ui/core'
import * as React from 'react'
import {ReactNode} from 'react'
import {utilsStyles} from '../../core/theme'
import {classes} from '../../core/helper/utils'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    borderRadius: 2,
    padding: `${utilsStyles(t).padding()} !important`,
    // padding: '0 !important',
    // margin: t.spacing(1),
    // margin: padding(),
  }
}));

interface Props extends React.HTMLAttributes<HTMLDivElement>, PanelHeadProps {
  className?: any;
  children: ReactNode;
}

export const PanelHead = ({className, children, ...other}: Props) => {
  const css = useStyles();
  return (
    <MxPanelHeader {...other} className={classes(css.root, className)}>
      {children}
    </MxPanelHeader>
  );
};
