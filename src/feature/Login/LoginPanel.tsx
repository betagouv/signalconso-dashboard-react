import makeStyles from '@mui/styles/makeStyles'
import {Theme} from '@mui/material'
import {styleUtils} from '../../core/theme'
import * as React from 'react'
import {Panel, PanelBody} from '../../shared/Panel'
import {ReactNode} from 'react'

const useStyles = makeStyles((t: Theme) => ({
  title: {
    marginTop: 0,
    marginBottom: t.spacing(3),
    textAlign: 'center',
    fontSize: styleUtils(t).fontSize.bigTitle,
  },
  panelBody: {
    padding: t.spacing(4),
  },
}))

interface Props {
  title: string
  children: ReactNode
}

export const LoginPanel = ({title, children}: Props) => {
  const css = useStyles()
  return (
    <Panel>
      <PanelBody className={css.panelBody}>
        <h1 className={css.title}>{title}</h1>
        {children}
      </PanelBody>
    </Panel>
  )
}
