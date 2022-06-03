import * as React from "react";
import {ReactNode} from "react";
import {BoxProps, Icon, Theme} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import {styleUtils} from "../../core/theme";
import {PanelTitle} from "./PanelTitle";

interface Props extends BoxProps {
  className?: string
  children: ReactNode
  action?: ReactNode
  icon?: string
}

export const PanelHead = ({icon, children, action, sx, ...other}: Props) => {
  return (
    <PanelTitle {...other} sx={{
      ...sx,
      p: 2,
      pb: 0,
      m: 0,
      display: 'flex',
      alignItems: 'center',
    }}>
      {icon && <Icon sx={{color: t => t.palette.text.disabled, mr: 1}}>{icon}</Icon>}
      <div style={{flex: 1}}>{children}</div>
      {action}
    </PanelTitle>
  )
}
