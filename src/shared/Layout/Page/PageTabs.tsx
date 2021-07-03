import {makeStyles, Tab, Tabs, Theme} from '@material-ui/core'
import * as React from 'react'
import {ReactElement, useState} from 'react'
import {useHistory, useLocation} from 'react-router'

interface Props {
  children: Array<ReactElement<PageTabProps>>
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    marginBottom: t.spacing(3),
    borderBottom: '1px solid ' + t.palette.divider,
  }
}))

export const PageTabs = ({children}: Props) => {
  const {pathname} = useLocation()
  const getActiveIndex = () => children.map(_ => _.props.to).indexOf(pathname)
  const css = useStyles()
  const [value, setValue] = useState(getActiveIndex())


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
  to: string
  label?: string
  icon?: string | React.ReactElement
  disabled?: boolean
}

export const PageTab = ({to, ...props}: PageTabProps) => {
  const history = useHistory()
  return (
    <Tab {...props} onClick={() => history.push(to)}/>
  )
}

