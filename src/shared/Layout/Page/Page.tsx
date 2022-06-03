import * as React from "react";
import {ReactNode} from "react";
import {Page as MuiPage} from "mui-extension";
import {LinearProgress, Theme} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

export const pageWidth = {
  xl: 1400,
  l: 1100,
  m: 932,
  s: 680
};

export interface PageProps {
  className?: string
  large?: boolean
  size?: 'xl' | 'l' | 's' | 'm'
  children: ReactNode
  loading?: boolean
}

export const Page = ({className, loading, size, ...props}: PageProps) => {
  return (
    <>
      {loading && (
        <div style={{position: "relative"}}>
          <LinearProgress sx={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0
          }} />
        </div>
      )}
      <MuiPage
        sx={{
          p: 2,
          pt: 3,
        }}
        width={pageWidth[size ?? "m"]}
        className={className}
        {...props}
      />
    </>
  )
}
