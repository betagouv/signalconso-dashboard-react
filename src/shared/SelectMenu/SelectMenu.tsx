import {Checkbox, Menu, MenuItem, Theme} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import React, {useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'

interface Props<T> {
  options: T[]
  open: boolean
  anchorEl: HTMLElement | null
  onChange: (_: T[]) => void
  multiple?: boolean
  onClose: () => void
  initialValue: T[]
  toString?: (t: T) => string
  renderValue?: (value: T) => React.ReactNode
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
  renderValue,
  toString = _ => _ + '',
}: Props<T>) => {
  const [innerValue, setInnerValue] = useState<T[]>([])
  const css = useStyles()
  const {m} = useI18n()
  const emptyOptions: T[] = []
  const allSelected = options.length === innerValue.length

  const someValuesSelected = innerValue.length > 1 && innerValue.length < options.length

  useEffect(() => {
    setInnerValue(initialValue)
  }, [])

  return (
    <Menu open={open} anchorEl={anchorEl} onClose={onClose}>
      {!multiple && <MenuItem value="">&nbsp;</MenuItem>}
      {multiple && (
        <MenuItem
          className={css.menuItem}
          dense
          key="all"
          value="all"
          onClick={e => {
            if (allSelected || (!allSelected && someValuesSelected)) {
              onChange(emptyOptions)
              setInnerValue(emptyOptions)
            } else {
              onChange(options)
              setInnerValue(options)
            }
          }}
        >
          <Checkbox indeterminate={!allSelected && someValuesSelected} checked={allSelected} />
          {m.selectAll}
        </MenuItem>
      )}
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
          {renderValue ? renderValue(option) : option}
        </MenuItem>
      ))}
    </Menu>
  )
}
