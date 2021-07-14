import {alpha, makeStyles, Radio, Theme} from '@material-ui/core'
import React, {MouseEventHandler, ReactNode} from 'react'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {classes} from 'core/helper/utils'

const useStyle = makeStyles((t: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    border: '1px solid ' + t.palette.divider,
    borderBottomColor: 'transparent',
    padding: t.spacing(1.5, 2, 1.5, 1),
    transition: 'all .2s ease-in-out',
    cursor: 'pointer',

    '&:last-of-type': {
      borderBottom: '1px solid ' + t.palette.divider,
      borderBottomRightRadius: 6,
      borderBottomLeftRadius: 6,
    },
    '&:first-of-type': {
      borderTopRightRadius: 6,
      borderTopLeftRadius: 6,
    },
    '&:hover': {
      zIndex: 1,
      border: `1px solid ${t.palette.primary.main}`,
      background: 'rgba(0,0,0,.04)',
    },
  },
  rootSelected: {
    zIndex: 1,
    border: `1px solid ${t.palette.primary.main} !important`,
    background: alpha(t.palette.primary.main, .1),
    boxShadow: `inset 0 0 0 1px ${t.palette.primary.main}`,
  },
  body: {
    marginLeft: t.spacing(1),
  },
}))

export interface ScRadioGroupItemProps {
  className?: string
  title?: string | ReactNode
  description?: string | ReactNode
  value: string
  selected?: boolean
  children?: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

export const ScRadioGroupItem = ({title, description, value, children, selected, onClick, className}: ScRadioGroupItemProps) => {
  const css = useStyle()

  return (
    <div className={classes(css.root, selected && css.rootSelected, className)} onClick={onClick}>
      <Radio checked={selected}/>
      <div className={css.body}>
        {title && <Txt block size="big">{title}</Txt>}
        {description && <Txt block color="hint">{description}</Txt>}
        {children && children}
      </div>
    </div>
  )
}
