import * as React from 'react'
import {makeStyles, Slide, Theme} from '@material-ui/core'
import {sidebarWith} from '../Layout'
import {pageWidth} from '..'
import {Link} from 'react-router-dom'
import {classes} from '../../../core/helper/utils'

export const headerHeight = 56;

const useStyles = makeStyles((t: Theme) => ({
  root: {
    height: headerHeight,
    display: 'flex',
    alignItems: 'center',
    paddingRight: t.spacing(3),
    paddingLeft: t.spacing(3),
    background: 'none',
    borderBottom: `1px solid ${t.palette.divider}`,
  },
  hidden: {
    visibility: 'hidden',
  },
  title: {
    width: sidebarWith,
  },
  content: {
    margin: 'auto',
    width: pageWidth,
    fontSize: t.typography.h6.fontSize,
    display: 'flex',
    alignItems: 'center',
  }
}));

export const Header = ({className, children}: any) => {
  const css = useStyles();
  return (
    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
      <header className={classes(css.root, className)}>
        <Link to="/workspace" className={css.title}>mediarithmics</Link>
        <div className={css.content}>{children}</div>
      </header>
    </Slide>
  );
};
