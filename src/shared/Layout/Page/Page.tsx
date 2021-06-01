import * as React from 'react'
import {Page as MuiPage} from 'mui-extension'
import {makeStyles, Theme} from '@material-ui/core'
import {classes} from '../../../core/helper/utils'

export const pageWidth = 932;

const useStyles = makeStyles((t: Theme) => ({
  root: {
    marginTop: `${t.spacing(2)}px !important`
  }
}));


export const Page = ({className, ...props}: any) => {
  const css = useStyles();
  return (
    <MuiPage width={pageWidth} className={classes(className, css.root)} {...props}/>
  );
};
