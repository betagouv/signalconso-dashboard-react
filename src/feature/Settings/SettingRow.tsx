import React, {ReactNode} from 'react'
import { Icon, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useI18n} from '../../core/i18n'

interface Props {
  icon?: string
  children?: ReactNode
  title?: string
  description?: string
}

const useStyles = makeStyles((t: Theme) => ({
  icon: {
    color: t.palette.text.secondary,
    marginRight: t.spacing(2),
  },
  root: {
    padding: t.spacing(1.5, 2),
    display: 'flex',
    alignItems: 'center',
    '&:not(:last-of-type)': {
      borderBottom: '1px solid ' + t.palette.divider,
    },
  },
  body: {
    flex: 1,
  },
}))

export const SettingRow = ({title, description, icon, children}: Props) => {
  const {m} = useI18n()
  const css = useStyles()

  return (
    <div className={css.root}>
      <Icon className={css.icon}>{icon}</Icon>
      <div className={css.body}>
        <Txt block size="big">
          {title}
        </Txt>
        {description && (
          <Txt block color="hint">
            {description}
          </Txt>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}
