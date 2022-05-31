import {Badge, Checkbox, Icon, Menu, MenuItem, Theme, Tooltip} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React from 'react'
import {IconBtn} from 'mui-extension/lib'
import {DatatableColumnProps} from './Datatable'

interface Props {
  // Hack because there is no way to make TS understand that the key of an object can
  // only be a string ({[key: string]: string} does not work...)
  columns: (Omit<DatatableColumnProps<any>, 'id'> & {id: string})[]
  hiddenColumns: string[]
  onChange: (_: string[]) => void
  className?: string
  title?: string
}

const useStyles = makeStyles((t: Theme) => ({
  cb: {
    paddingLeft: 0,
    paddingBottom: t.spacing(0.25),
    paddingTop: t.spacing(0.25),
  },
}))

export const DatatableColumnToggle = ({className, title, columns, hiddenColumns, onChange}: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const css = useStyles()

  // console.log(hiddenColumns, columns)
  return (
    <>
      <Tooltip title={title ?? ''}>
        <IconBtn className={className} color="primary" onClick={handleClick}>
          <Badge
            color="error"
            badgeContent={columns.length === hiddenColumns.length ? '!' : columns.length - hiddenColumns.length}
            invisible={hiddenColumns.length === 0}
          >
            <Icon color={columns.length === hiddenColumns.length ? 'error' : undefined}>table_chart</Icon>
          </Badge>
        </IconBtn>
      </Tooltip>
      <Menu anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {columns.map(col => {
          const checked = !hiddenColumns.includes(col.id)
          return (
            <MenuItem
              dense
              key={col.id}
              onClick={() => onChange(checked ? [...hiddenColumns, col.id] : hiddenColumns.filter(_ => _ !== col.id))}
            >
              <Checkbox className={css.cb} checked={checked} />
              {col.head}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
