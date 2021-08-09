import * as React from 'react'
import {CSSProperties, ReactNode} from 'react'
import {makeStyles, Theme} from '@material-ui/core'
import {alpha} from '@material-ui/core/styles'
import {styleUtils} from '../../core/theme'
import {classes} from '../../core/helper/utils'

export type LabelColor = 'error' | 'warning' | 'info' | 'success' | 'disable'

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  type?: LabelColor
  className?: string
  children: ReactNode
}

const colorize = (color: string): CSSProperties => ({
  background: alpha(color, .14),
  color: color
});

const useStyles = makeStyles((t: Theme) => ({
  root: {
    borderRadius: 2,
    padding: `${t.spacing(1 / 4)}px ${t.spacing(1)}px`,
    display: 'inline-block',
    fontWeight: t.typography.fontWeightMedium,
    ...colorize(t.palette.text.disabled),
  },
  error: {
    ...colorize(styleUtils(t).color.error),
  },
  warning: {
    ...colorize(styleUtils(t).color.warning),
  },
  success: {
    ...colorize(styleUtils(t).color.success),
  },
  info: {
    ...colorize(styleUtils(t).color.info),
  },
  disable: {
    ...colorize(t.palette.text.disabled),
  },
}));

export const Label = ({type, children, className, ...props}: Props) => {
  const css = useStyles();
  return (
    <span className={classes(css.root, type && css[type], className)} {...props}>
      {children}
    </span>
  );
};
