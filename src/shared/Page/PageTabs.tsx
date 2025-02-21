import { Tab, TabProps, Tabs } from '@mui/material'
import * as React from 'react'
import { ReactElement, useMemo } from 'react'
import { useLocation, useNavigate, useRouter } from '@tanstack/react-router'

interface Props {
  children: Array<ReactElement<PageTabProps> | undefined>
}

export const PageTabs = ({ children }: Props) => {
  const { pathname } = useLocation()
  const router = useRouter()
  const defaultTabIndex = 0
  const index = useMemo(() => {
    const currentTabIndex = children
      .map((child) => child?.props.to)
      .findIndex(
        (path) =>
          path &&
          pathname.includes(router.buildLocation({ to: path }).pathname),
      )
    return currentTabIndex !== -1 ? currentTabIndex : defaultTabIndex
  }, [router, pathname, children])

  return (
    <Tabs
      value={index}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        mb: 3,
        borderBottom: (t) => '1px solid ' + t.palette.divider,
      }}
    >
      {children}
    </Tabs>
  )
}

interface PageTabProps extends TabProps {
  to: string
  label?: string
  icon?: string | React.ReactElement
  disabled?: boolean
}

export const PageTab = ({ to, ...props }: PageTabProps) => {
  const history = useNavigate()
  return <Tab {...props} onClick={() => history({ to })} />
}
