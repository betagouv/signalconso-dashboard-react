import {Tab, TabProps, Tabs} from '@mui/material'
import * as React from 'react'
import {ReactElement, useMemo, useState} from 'react'
import {useNavigate, useLocation} from 'react-router'

interface Props {
  children: Array<ReactElement<PageTabProps>>
}

export const PageTabs = ({children}: Props) => {
  const {pathname} = useLocation()
  const defaultTabIndex = 0
  const index = useMemo(() => {
    const currentTabIndex = children.map(child => child.props.to).findIndex(path => pathname.includes(path))
    return currentTabIndex !== -1 ? currentTabIndex : defaultTabIndex
  }, [pathname])

  const [value, setValue] = useState(Math.max(defaultTabIndex, index))

  const handleChange = (event: any, index: number) => {
    setValue(index)
  }

  return (
    <Tabs
      value={value}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
      onChange={handleChange}
      sx={{
        mb: 3,
        borderBottom: t => '1px solid ' + t.palette.divider,
      }}
    >
      {children}
    </Tabs>
  )
}

export interface PageTabProps extends TabProps {
  to: string
  label?: string
  icon?: string | React.ReactElement
  disabled?: boolean
}

export const PageTab = ({to, ...props}: PageTabProps) => {
  const history = useNavigate()
  return <Tab {...props} onClick={() => history(to)} />
}
