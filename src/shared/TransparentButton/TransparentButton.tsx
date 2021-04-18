import * as React from 'react'
import {makeStyles, Theme} from '@material-ui/core'
import {classes} from '../../core/helper/utils'

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
    <button {...props} className={classes(className, css.root)}/>
  );
};
