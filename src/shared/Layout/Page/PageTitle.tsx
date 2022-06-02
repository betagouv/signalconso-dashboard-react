import * as React from "react";
import { ReactNode } from "react";
import { Theme, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

interface Props {
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const PageTitle = ({ className, action, children, ...props }: Props) => {
  return (
    <Typography
      variant="h5"
      className={className}
      sx={{
        mt: 1,
        mb: 3,
        display: 'flex',
        alignItems: 'center'
      }}
      {...props}
    >
      {children}
      {action && <div style={{marginLeft: 'auto'}}>{action}</div>}
    </Typography>
  );
};
