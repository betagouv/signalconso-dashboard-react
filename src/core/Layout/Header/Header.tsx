import { alpha, Box, BoxProps, Icon } from '@mui/material'
import { IconBtn } from '../../../alexlibs/mui-extension'
import { useLayoutContext } from '../../context/layoutContext/layoutContext'
import { layoutConfig } from '../layoutConfig'

type HeaderProps = BoxProps

export const Header = ({ children }: HeaderProps) => {
  const { sidebarOpen, showSidebarButton, setSidebarOpen } = useLayoutContext()

  return (
    <Box
      component="header"
      sx={{
        minHeight: layoutConfig.headerHeight,
        px: layoutConfig.headerPx,
        py: 0.5,
        display: 'flex',
        alignItems: 'center',
        background: (t) => t.palette.background.paper,
        borderBottom: (t) => '1px solid ' + t.palette.divider,
      }}
    >
      <div className="flex items-center w-full">
        {showSidebarButton && (
          <IconBtn
            sx={{
              mr: 1,
              border: (t) => `2px solid ${t.palette.primary.main}`,
              background: (t) =>
                sidebarOpen ? 'none' : alpha(t.palette.primary.main, 0.1),
              color: (t) => t.palette.primary.main,
              '&:hover': {
                background: (t) => alpha(t.palette.primary.main, 0.1),
              },
            }}
            onClick={() => setSidebarOpen((_) => !_)}
          >
            <Icon>menu</Icon>
          </IconBtn>
        )}
        {children}
      </div>
    </Box>
  )
}
