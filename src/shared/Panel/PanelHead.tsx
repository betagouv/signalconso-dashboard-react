import {PanelHead as MxPanelHeader, PanelHeadProps} from 'mui-extension';
import {makeStyles} from '@material-ui/core';
import {Theme} from '@material-ui/core';
import * as React from 'react';
import {ReactNode} from 'react';
import classNames from 'classnames';
import {theme} from '../../core/theme';

const useStyles = makeStyles((t: Theme) => ({
  root: {
    borderRadius: 2,
    padding: `${theme.padding()} !important`,
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
  const classes = useStyles();
  return (
    <MxPanelHeader {...other} className={classNames(classes.root, className)}>
      {children}
    </MxPanelHeader>
  );
};
