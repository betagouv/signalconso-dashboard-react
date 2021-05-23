import * as React from 'react'
import {useEffect} from 'react'
import {Checkbox, createStyles, Icon, InputAdornment, InputBase, makeStyles, Menu, MenuItem, Theme} from '@material-ui/core'
import {Region} from '@signalconso/signalconso-api-sdk-js/build'
import {regions as apiRegions} from '@signalconso/signalconso-api-sdk-js/build/asset'
import {useSetState, UseSetState} from '@alexandreannic/react-hooks-lib/lib'
import {classes, stopPropagation} from '../../core/helper/utils'
import {useUtilsCss} from '../../core/utils/useUtilsCss'

const useStyles = makeStyles((t: Theme) => createStyles({
  adornment: {
    height: 20,
    color: t.palette.text.secondary,
    verticalAlign: 'top',
  },
  regionLabel: {
    fontWeight: t.typography.fontWeightBold,
    flex: 1,
  },
  regionToggleArrow: {
    width: 40,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: t.spacing(1),
    borderRadius: 4,
    color: t.palette.text.disabled,
    '&:hover, &:active, &:focus': {
      background: t.palette.action.hover,
      color: t.palette.primary.main,
    }
  },
  menuItem: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: t.spacing(1 / 2),
    paddingLeft: t.spacing(1 / 2),
  },
  menuItemRegion: {
    borderBottom: `1px solid ${t.palette.divider}`,
  }
}))

export interface SelectDepartmentsProps {
  values?: string[]
  readonly?: boolean
  regions?: Region[]
  onChange: (_: string[]) => void
}

export const SelectDepartments = ({values, readonly, regions = apiRegions, onChange}: SelectDepartmentsProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  let $input: HTMLElement | undefined = undefined
  const css = useStyles()
  const cssUtils = useUtilsCss()
  const indexValues: UseSetState<string> = useSetState<string>()
  const openedRegions: UseSetState<string> = useSetState<string>()

  useEffect(() => {
    if (values) indexValues.reset(values)
  }, [values])

  const open = (event: any) => setAnchorEl(event.currentTarget)

  const close = () => {
    setAnchorEl(null)
  }

  const onSelectDepartments = (departments: string[]) => {
    indexValues.toggleAll(departments)
    onChange(indexValues.toArray())
  }

  const toggleRegionOpen = (regionLabel: string) => {
    openedRegions.toggle(regionLabel)
    onChange(indexValues.toArray())
  }

  return (
    <>
      <InputBase
        onClick={open}
        value={indexValues.toArray().join(', ') ?? ''}
        disabled={readonly}
        inputRef={(n: any) => $input = n ?? undefined}
        endAdornment={
          <InputAdornment position="end">
            <Icon className={css.adornment}>arrow_drop_down</Icon>
          </InputAdornment>
        }
      />
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={close}>
        {regions.map(region => {
          const allChecked = region.departments.every(_ => indexValues.has(_.code))
          const atLeastOneChecked = !!region.departments.find(_ => indexValues.has(_.code))
          return [
            <MenuItem className={classes(css.menuItem, css.menuItemRegion)} key={region.label} onClick={() => onSelectDepartments(region.departments.map(_ => _.code))}>
              <Checkbox indeterminate={atLeastOneChecked && !allChecked} checked={allChecked}/>
              <span className={css.regionLabel}>{region.label}</span>
              <Icon
                className={classes(css.regionToggleArrow, openedRegions.has(region.label) && cssUtils.colorPrimary)}
                onClick={stopPropagation(() => toggleRegionOpen(region.label))}>
                {openedRegions.has(region.label) ? 'expand_less' : 'expand_more'}
              </Icon>
            </MenuItem>,
            openedRegions.has(region.label) ? region.departments.map(department =>
              <MenuItem className={css.menuItem} dense onClick={() => indexValues.toggle(department.code)}>
                <Checkbox checked={indexValues.has(department.code)}/>
                ({department.code}) {department.label}
              </MenuItem>
            ) : []
          ]
        })}
      </Menu>
    </>
  )
}
