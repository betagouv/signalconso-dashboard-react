import {Box, BoxProps, Icon, Slide} from '@mui/material'
import {IconBtn} from 'mui-extension/lib'
import {layoutConfig} from '../index'
import React from 'react'
import {useLayoutContext} from '../LayoutContext'

interface Props extends BoxProps {
}

export const Header = ({children}: Props) => {
  const {sidebarOpen, showSidebarButton, setSidebarOpen} = useLayoutContext()


  return (
    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
      <Box
        component="header"
        sx={{
          minHeight: layoutConfig.headerHeight,
          px: layoutConfig.headerPx,
          py: 0.5,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          background: t => t.palette.background.paper,
          borderBottom: t => '1px solid ' + t.palette.divider
        }}
      >
        <div style={{display: 'flex', alignItems: 'center'}}>
          {showSidebarButton && (
            <IconBtn
              sx={{
                mr: 1,
                ...!sidebarOpen && {boxShadow: t => t.shadows[3]},
                color: t => t.palette.secondary.contrastText,
                backgroundColor: t => t.palette.secondary.main,
                '&:hover': {
                  background: t => t.palette.secondary.light
                }
              }}
              onClick={() => setSidebarOpen(_ => !_)}
            >
              <Icon>menu</Icon>
            </IconBtn>
          )}
          {children}
        </div>
      </Box>
    </Slide>
  )
}

