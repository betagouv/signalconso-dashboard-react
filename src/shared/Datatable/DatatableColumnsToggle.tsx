import {Checkbox, Icon, makeStyles, Menu, MenuItem, Theme, Tooltip} from '@material-ui/core'
import React from 'react'
import {IconBtn} from 'mui-extension/lib'
import {DatatableColumnProps} from './Datatable'

interface Props {
  // Hack because there is no way to make TS understand that the key of an object can
  // only be a string ({[key: string]: string} does not work...)
  columns: (Omit<DatatableColumnProps<any>, 'name'> & {name: string})[]
  displayedColumns: string[]
  onChange: (_: string[]) => void
  className?: string
  title?: string
}

const useStyles = makeStyles((t: Theme) => ({
  cb: {
    paddingLeft: 0,
    paddingBottom: t.spacing(.25),
    paddingTop: t.spacing(.25),
  }
}))

export const DatatableColumnToggle = ({className, title, columns, displayedColumns, onChange}: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const css = useStyles()

  return (
    <>
      <Tooltip title={title ?? ''}>
        <IconBtn className={className} onClick={handleClick}>
          <Icon>table_chart</Icon>
        </IconBtn>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {columns.filter(_ => _.head && _.head !== '').map(col => {
          const checked = displayedColumns.indexOf(col.name) > -1
          return (
            <MenuItem dense key={col.name} onClick={() => onChange(checked
              ? displayedColumns.length > 1 ? displayedColumns.filter(_ => _ !== col.name) : displayedColumns
              : [...displayedColumns, col.name])
            }>
              <Checkbox className={css.cb} checked={checked}/>
              {col.head}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
