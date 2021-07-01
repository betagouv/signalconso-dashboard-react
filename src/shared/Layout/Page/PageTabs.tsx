import {makeStyles, Tab, Tabs, Theme} from '@material-ui/core'
import * as React from 'react'
import {ReactNode, useState} from 'react'

interface Props {
  children: ReactNode
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    marginBottom: t.spacing(3),
    borderBottom: '1px solid ' + t.palette.divider,
  }
}))

export const PageTabs = ({children}: Props) => {
  const css = useStyles()
  const [value, setValue] = useState(0)

  const handleChange = (event: any, index: number) => {
    setValue(index)
  }
  return (
    <Tabs
      value={value}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleChange}
      className={css.root}
    >
      {children}
      {/*{tabs.map(tab =>*/}
      {/*  <Tab label={tab.label} icon={tab.icon} disabled={tab.disabled} onClick={() => console.log(tab.to)}/>*/}
      {/*)}*/}
    </Tabs>
  )
}

export interface PageTabProps {
  to?: string
  label?: string
  icon?: string | React.ReactElement
  disabled?: boolean
}

export const PageTab = ({to, ...props}: PageTabProps) => {
  return (
    <Tab {...props} onClick={() => console.log(to)}/>
  )
}
