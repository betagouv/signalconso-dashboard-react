import * as React from 'react';
import {Page as MuiPage} from 'mui-extension';
import {makeStyles} from '@material-ui/core';
import {Theme} from '@material-ui/core';
import classNames from 'classnames';

export const pageWidth = 932;

const useStyles = makeStyles((t: Theme) => ({
  root: {
    marginTop: t.spacing(1)
  }
}));


export const Page = ({className, ...props}: any) => {
  const css = useStyles();
  return (
    <MuiPage width={pageWidth} className={classNames(className, css.root)} {...props}/>
  );
};
