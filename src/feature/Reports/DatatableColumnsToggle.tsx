import {Checkbox, Icon, makeStyles, Menu, MenuItem, Theme} from '@material-ui/core'
import React from 'react'
import {IconBtn} from 'mui-extension/lib'

interface Props {
  columns: string[]
  displayedColumns: string[]
  onChange: (_: string[]) => void
  className?: string
}

const useStyles = makeStyles((t: Theme) => ({
  cb: {
    paddingLeft: 0,
    paddingBottom: t.spacing(.25),
    paddingTop: t.spacing(.25),
  }
}))

export const DatatableColumnToggle = ({className, columns, displayedColumns, onChange}: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const css = useStyles()

  return (
    <>
      <IconBtn className={className} onClick={handleClick}>
        <Icon>table_chart</Icon>
      </IconBtn>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {columns.map(col => {
          const checked = displayedColumns.indexOf(col) > -1
          return (
            <MenuItem dense key={col} onClick={() => onChange(checked
              ? displayedColumns.length > 1 ? displayedColumns.filter(_ => _ !== col) : displayedColumns
              : [...displayedColumns, col])
            }>
              <Checkbox className={css.cb} checked={checked}/>
              {col}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
