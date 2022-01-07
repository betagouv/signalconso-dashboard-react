import { Tab, Tabs, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import * as React from 'react'
import {ReactElement, useMemo, useState} from 'react'
import {useHistory, useLocation} from 'react-router'

interface Props {
  children: Array<ReactElement<PageTabProps>>
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    marginBottom: t.spacing(3),
    borderBottom: '1px solid ' + t.palette.divider,
  },
}))

export const PageTabs = ({children}: Props) => {
  const {pathname} = useLocation()
  const index = useMemo(() => children.map(_ => _.props.to).indexOf(pathname), [pathname])
  const css = useStyles()
  const [value, setValue] = useState(Math.max(0, index))

  const handleChange = (event: any, index: number) => {
    setValue(index)
  }

  return (
    <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange} className={css.root}>
      {children}
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
  return <Tab {...props} onClick={() => history.push(to)} />
}
