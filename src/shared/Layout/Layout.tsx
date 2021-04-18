import * as React from 'react'
import {ReactNode} from 'react'
import {makeStyles, Theme} from '@material-ui/core'
import {LayoutProvider, useLayoutContext} from './LayoutContext'
import {classes} from '../../core/helper/utils'

export const sidebarWith = 220;

const useStyles = makeStyles((t: Theme) => ({
  root: {
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  rootDesktop: {
  },
}));

interface IProps {
  title?: string
  children?: ReactNode
  mobileBreakpoint?: number
  header?: ReactNode
  sidebar?: ReactNode
}

export const Layout = ({mobileBreakpoint, children, sidebar, header}: IProps) => {
  return (
    <LayoutProvider mobileBreakpoint={mobileBreakpoint}>
      <LayoutUsingContext sidebar={sidebar} header={header}>
        {children}
      </LayoutUsingContext>
    </LayoutProvider>
  );
};

const LayoutUsingContext = ({children, header: Header, sidebar: Sidebar}: any) => {
  const css = useStyles();
  const {isMobileWidth} = useLayoutContext();
  return (
    <div>
      {Header && <Header/>}
      <div className={classes(css.root, !isMobileWidth && css.rootDesktop)}>
        {Sidebar && <Sidebar/>}
        {children}
      </div>
    </div>
  );
};
