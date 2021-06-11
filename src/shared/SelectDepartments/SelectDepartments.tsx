import * as React from 'react'
import {useEffect, useMemo} from 'react'
import {Checkbox, createStyles, Icon, InputAdornment, makeStyles, Menu, MenuItem, TextField, Theme} from '@material-ui/core'
import {useSetState, UseSetState} from '@alexandreannic/react-hooks-lib/lib'
import {classes, stopPropagation} from '../../core/helper/utils'
import {useUtilsCss} from '../../core/utils/useUtilsCss'
import {useConstantContext} from '../../core/context/ConstantContext'
import {Region} from 'core/api'
import {fromNullable} from 'fp-ts/lib/Option'

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
  },
  cbDepartment: {
    paddingTop: `6px !important`,
    paddingBottom: `6px !important`,
  }
}))

export interface SelectDepartmentsProps {
  placeholder?: string
  selectAllLabel?: string
  values?: string[]
  readonly?: boolean
  regions: Region[]
  onChange: (_: string[]) => void
  className?: string
  fullWidth?: boolean
}

const withRegions = (WrappedComponent: React.ComponentType<SelectDepartmentsProps>) => (props: Omit<SelectDepartmentsProps, 'regions'>) => {
  const {regions} = useConstantContext()
  useEffect(() => {
    regions.fetch()()
  }, [])
  return fromNullable(regions.entity).map(_ => <WrappedComponent {...props} regions={_}/>).getOrElse(<></>)
}

export const SelectDepartments = withRegions(({
  placeholder,
  selectAllLabel = 'Tous les départements',
  values,
  className,
  readonly,
  regions,
  onChange,
  fullWidth,
}: SelectDepartmentsProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  let $input: HTMLElement | undefined = undefined
  const css = useStyles()
  const cssUtils = useUtilsCss()
  const indexValues: UseSetState<string> = useSetState<string>()
  const openedRegions: UseSetState<string> = useSetState<string>()
  const allDepartments = useMemo(() => regions.flatMap(_ => _.departments).map(_ => _.code), [])
  const allDepartmentsSelected = allDepartments.every(_ => indexValues.has(_))
  const someDepartmentsSelected = !!allDepartments.find(_ => indexValues.has(_))

  useEffect(() => {
    indexValues.reset(values)
  }, [values])

  const open = (event: any) => setAnchorEl(event.currentTarget)

  const close = () => {
    setAnchorEl(null)
  }

  const onSelectDepartments = (departments: string[]) => {
    indexValues.toggleAll(departments)
    onChange(indexValues.toArray())
  }

  const onSelectDepartment = (department: string) => {
    indexValues.toggle(department)
    onChange(indexValues.toArray())
  }

  const onSelectAll = () => {
    allDepartments.forEach(allDepartmentsSelected ? indexValues.delete : indexValues.add)
    onChange(indexValues.toArray())
  }

  const toggleRegionOpen = (regionLabel: string) => {
    openedRegions.toggle(regionLabel)
  }

  return (
    <>
      <TextField
        fullWidth={fullWidth}
        variant="outlined"
        margin="dense"
        size="small"
        className={className}
        placeholder={placeholder}
        onClick={open}
        value={indexValues.toArray().join(', ') ?? ''}
        disabled={readonly}
        inputRef={(n: any) => $input = n ?? undefined}
        label="Département"
        InputProps={{
          endAdornment:
            <InputAdornment position="end">
              <Icon className={css.adornment}>arrow_drop_down</Icon>
            </InputAdornment>
        }}
      />
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={close}>
        <MenuItem className={classes(css.menuItem, css.menuItemRegion)} onClick={() => onSelectAll()}>
          <Checkbox indeterminate={someDepartmentsSelected && !allDepartmentsSelected} checked={allDepartmentsSelected}/>
          {selectAllLabel}
        </MenuItem>
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
              <MenuItem className={css.menuItem} dense onClick={() => onSelectDepartment(department.code)}>
                <Checkbox className={css.cbDepartment} checked={indexValues.has(department.code)}/>
                <span className={cssUtils.colorTxtHint}>({department.code})</span>
                &nbsp;
                {department.label}
              </MenuItem>
            ) : []
          ]
        })}
      </Menu>
    </>
  )
})
