import * as React from 'react';
import {Theme} from '@material-ui/core';
import {makeStyles} from '@material-ui/core';
import classNames from 'classnames';

type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const useStyles = makeStyles((t: Theme) => ({
  root: {
    border: 'none',
    paddingLeft: 0,
    paddingRight: 0,
    fontSize: 'inherit',
    cursor: 'pointer',
    background: 'transparent',
  }
}));

export const TransparentButton = ({className, ...props}: Props) => {
  const css = useStyles();
  return (
    <button {...props} className={classNames(className, css.root)}/>
  );
};
