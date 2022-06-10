import {Box, BoxProps, ListItemIcon, ListItemText, MenuItem} from "@mui/material";
import React from "react";


interface WebsiteToolProps extends BoxProps {
  url: string
  src: string
  alt?: string
  label: string
}


export const WebsiteTool = ({url, src, alt, label, ...props}: WebsiteToolProps) => {
  return (
    <MenuItem onClick={() => window.open(url)}>
      <ListItemIcon>
        <Box
          {...props}
          component="img"
          src={src}
          alt={alt}
          sx={{
            height: 18,
          }}
        />
      </ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </MenuItem>
  )
}