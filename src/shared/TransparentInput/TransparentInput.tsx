import * as React from 'react';
import {Theme} from '@material-ui/core';
import {makeStyles} from '@material-ui/core';
import classNames from 'classnames';

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const useStyles = makeStyles((t: Theme) => ({
  root: {
    border: 'none',
    paddingLeft: 0,
    paddingRight: 0,
    fontSize: 'inherit',
    background: 'transparent',
    color: 'inherit',
    fontWeight: 'inherit',
    fontFamily: 'inherit',
    lineHeight: 'inherit',
    padding: 0,
    '&::placeholder': {
      color: t.palette.text.disabled,
      fontStyle: 'italic',
    },
    '&:focus': {
      color: t.palette.primary.main,
      textDecoration: 'underline',
    }
  }
}));

export const TransparentInput = ({className, ...props}: Props) => {
  const css = useStyles();
  return (
    <input {...props} className={classNames(className, css.root)}/>
  );
};
