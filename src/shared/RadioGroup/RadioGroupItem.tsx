import {alpha, makeStyles, Radio, Theme} from '@material-ui/core'
import React, {MouseEventHandler, ReactNode} from 'react'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {classes} from 'core/helper/utils'

const useStyle = makeStyles((t: Theme) => ({
  root: {
    display: 'flex',
    // alignItems: 'center',
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
  rootDense: {
    paddingTop: t.spacing(1 / 4),
    paddingBottom: t.spacing(1 / 4),
  },
  rootSelected: {
    zIndex: 1,
    border: `1px solid ${t.palette.primary.main} !important`,
    background: alpha(t.palette.primary.main, 0.1),
    boxShadow: `inset 0 0 0 1px ${t.palette.primary.main}`,
  },
  rootError: {
    borderColor: t.palette.error.main + ' !important',
  },
  body: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: 42,
    flexDirection: 'column',
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
  dense?: boolean
  error?: boolean
}

export const ScRadioGroupItem = ({
  title,
  description,
  error,
  dense,
  value,
  children,
  selected,
  onClick,
  className,
}: ScRadioGroupItemProps) => {
  const css = useStyle()

  return (
    <div
      className={classes(css.root, dense && css.rootDense, selected && css.rootSelected, error && css.rootError, className)}
      onClick={onClick}
    >
      <Radio checked={selected} />
      <div className={css.body}>
        {title && (
          <Txt block size="big">
            {title}
          </Txt>
        )}
        {description && (
          <Txt block color="hint">
            {description}
          </Txt>
        )}
        {children && children}
      </div>
    </div>
  )
}
