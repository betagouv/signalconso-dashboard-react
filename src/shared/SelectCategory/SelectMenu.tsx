import {Checkbox, createStyles, makeStyles, Menu, MenuItem, Theme} from '@material-ui/core'
import React, {useEffect, useState} from 'react'

interface Props {
  options: string[]
  open: boolean
  anchorEl: HTMLElement | null
  onChange: (_: string[]) => void
  multiple?: boolean
  onClose: () => void
  initialValue: string[]
}

const useStyles = makeStyles((t: Theme) => createStyles({
  menuItem: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: t.spacing(1 / 2),
    paddingLeft: t.spacing(1 / 2),
  },
}))

export const SelectMenu = ({
  options,
  open,
  anchorEl,
  onChange,
  multiple,
  onClose,
  initialValue,
}: Props) => {
  const [innerValue, setInnerValue] = useState<string[]>([])
  const css = useStyles()

  useEffect(() => {
    setInnerValue(initialValue)
  }, [])

  return (
    <Menu open={open} anchorEl={anchorEl} onClose={onClose}>
      {!multiple && <MenuItem value="">&nbsp;</MenuItem>}
      {options.map(option =>
        <MenuItem className={css.menuItem} key={option} value={option} dense onClick={() => {
          if (multiple) {
            const newValue = !!innerValue.find(_ => _ === option) ? innerValue.filter(_ => _ !== option) : [...innerValue, option]
            onChange(newValue)
            setInnerValue(newValue)
          } else {
            onChange([option])
            setInnerValue([option])
          }
        }}>
          {multiple && <Checkbox checked={innerValue.indexOf(option) >= 0}/>}
          {option}
        </MenuItem>
      )}
    </Menu>
  )
}
