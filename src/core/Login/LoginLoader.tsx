import {CircularProgress, Theme} from '@material-ui/core'
import * as React from 'react'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
}));

export const LoginLoader = () => {
  const css = useStyles();
  return (
    <div className={css.root}>
      <CircularProgress/>
    </div>
  );
};
