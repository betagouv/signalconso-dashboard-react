import * as React from "react";
import {forwardRef, ReactNode} from "react";
import {Card, CardProps, LinearProgress, Theme} from "@mui/material";
import {classes} from "../../core/helper/utils";
import {createStyles, makeStyles} from "@mui/styles";

const useStyles = makeStyles((t: Theme) =>
  createStyles({
    root: {
      borderRadius: 6,
      marginBottom: t.spacing(2)
    },
    border: {
      border: `1px solid ${t.palette.divider}`
    },
    loader: {
      marginBottom: -4,
    },
    hover: {
      cursor: 'pointer',
      transition: t.transitions.create('all'),
      '&:hover': {
        transform: 'scale(1.01)',
        boxShadow: t.shadows[4],
      },
    },
    stretch: {
      display: 'flex',
      flexDirection: 'column',
      height: `calc(100% - ${t.spacing(2)})`,
    },
  }),
)

export interface PanelProps extends CardProps {
  loading?: boolean
  hoverable?: boolean
  stretch?: boolean
  elevation?: number
}

export const Panel = forwardRef(({
  elevation = 0,
  hoverable,
  loading,
  children,
  stretch,
  ...other
}: PanelProps, ref: any) => {
  return (
    <Card
      ref={ref}
      elevation={elevation}
      sx={{
        borderRadius: "6px",
        mb: 2,
        ...hoverable && {
          cursor: "pointer",
          transition: t => t.transitions.create("all"),
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: t => t.shadows[4]
          }
        },
        ...stretch && {
          display: "flex",
          flexDirection: "column",
          height: t => `calc(100% - ${t.spacing(2)})`
        },
        ...elevation === 0 && {
          border: t => `1px solid ${t.palette.divider}`
        }
      }}
      {...other}
    >
      {loading && <LinearProgress className={css.loader} />}
      {children}
    </Card>
  );
});
