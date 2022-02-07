import {Checkbox, Menu, MenuItem, Theme} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React, {useEffect, useState} from 'react'

interface Props<T> {
  options: T[]
  open: boolean
  anchorEl: HTMLElement | null
  onChange: (_: T[]) => void
  multiple?: boolean
  onClose: () => void
  initialValue: T[]
  toString?: (t: T) => string
}

const useStyles = makeStyles((t: Theme) =>
  createStyles({
    menuItem: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: t.spacing(1 / 2),
      paddingLeft: t.spacing(1 / 2),
    },
  }),
)

export const SelectMenu = <T,>({
  options,
  open,
  anchorEl,
  onChange,
  multiple,
  onClose,
  initialValue,
  toString = _ => _ + ''
}: Props<T>) => {
  const [innerValue, setInnerValue] = useState<T[]>([])
  const css = useStyles()

  useEffect(() => {
    setInnerValue(initialValue)
  }, [])

  return (
    <Menu open={open} anchorEl={anchorEl} onClose={onClose}>
      {!multiple && <MenuItem value="">&nbsp;</MenuItem>}
      {options.map((option, i) => (
        <MenuItem
          className={css.menuItem}
          key={toString(option)}
          value={toString(option)}
          dense
          onClick={() => {
            if (multiple) {
              const newValue = !!innerValue.find(_ => _ === option)
                ? innerValue.filter(_ => _ !== option)
                : [...innerValue, option]
              onChange(newValue)
              setInnerValue(newValue)
            } else {
              onChange([option])
              setInnerValue([option])
            }
          }}
        >
          {multiple && <Checkbox checked={innerValue.indexOf(option) >= 0} />}
          {option}
        </MenuItem>
      ))}
    </Menu>
  )
}
