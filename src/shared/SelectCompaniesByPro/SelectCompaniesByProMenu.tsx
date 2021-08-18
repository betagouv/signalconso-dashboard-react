import {Checkbox, createStyles, Icon, makeStyles, Menu, MenuItem, Theme} from '@material-ui/core'
import {classes} from '../../core/helper/utils'
import * as React from 'react'
import {useEffect, useMemo} from 'react'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {useSetState, UseSetState} from '@alexandreannic/react-hooks-lib/lib'
import {Company, CompanyWithAccessLevel} from '../../core/api'
import {useI18n} from '../../core/i18n'

const useStyles = makeStyles((t: Theme) =>
  createStyles({
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
      },
    },
    locationIcon: {
      fontSize: 20,
    },
    menuItem: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: t.spacing(1 / 2),
    },
    menuItemImportant: {
      fontWeight: t.typography.fontWeightBold,
      borderBottom: `1px solid ${t.palette.divider}`,
    },
    cbDepartment: {
      paddingTop: `6px !important`,
      paddingBottom: `6px !important`,
    },
  }),
)

interface SelectCompaniesProMenuProps {
  accessibleCompanies: CompanyWithAccessLevel[]
  visibleCompanies: Company[]
  onClose: () => void
  initialValues?: string[]
  anchorEl: HTMLElement | null
  open: boolean
  onChange: (departments: string[]) => void
}

export const SelectCompaniesByProMenu = ({
  onClose,
  initialValues,
  anchorEl,
  open,
  onChange,
  accessibleCompanies,
  visibleCompanies,
}: SelectCompaniesProMenuProps) => {
  const css = useStyles()
  const cssUtils = useCssUtils()
  const indexValues: UseSetState<string> = useSetState<string>()
  const {m} = useI18n()

  const allSelected = useMemo(() => indexValues.size === visibleCompanies.length, [indexValues, visibleCompanies])
  const allAccessSelected = useMemo(
    () => accessibleCompanies.every(_ => indexValues.has(_.siret)),
    [indexValues, accessibleCompanies],
  )
  const someSelected = useMemo(
    () => !allSelected && !!visibleCompanies.find(_ => indexValues.has(_.siret)),
    [indexValues, visibleCompanies],
  )

  useEffect(() => {
    indexValues.reset(initialValues)
  }, [])

  const onSelectAll = () => {
    visibleCompanies.map(_ => _.siret).forEach(allSelected ? indexValues.delete : indexValues.add)
    onChange(indexValues.toArray())
  }

  const onSelectAccess = () => {
    accessibleCompanies.map(_ => _.siret).forEach(allAccessSelected ? indexValues.delete : indexValues.add)
    onChange(indexValues.toArray())
  }

  const onSelect = (company: Company) => {
    indexValues.toggle(company.siret)
    onChange(indexValues.toArray())
  }

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem className={classes(css.menuItem, css.menuItemImportant)} onClick={() => onSelectAll()}>
        <Checkbox indeterminate={someSelected} checked={allSelected} />
        {m.allMyCompanies}
      </MenuItem>
      <MenuItem className={classes(css.menuItem, css.menuItemImportant)} onClick={() => onSelectAccess()}>
        <Checkbox indeterminate={!allAccessSelected && someSelected} checked={allAccessSelected} />
        {m.allSubCompanies}
      </MenuItem>
      {visibleCompanies.map(company => (
        <MenuItem className={css.menuItem} key={company.siret} dense onClick={() => onSelect(company)}>
          <Checkbox className={css.cbDepartment} checked={indexValues.has(company.siret)} />
          <span className={cssUtils.colorTxtSecondary}>{company.siret.slice(0, 9)}</span>
          <span className={cssUtils.txtBold}>{company.siret.substr(9, 14)}</span>
          <span className={classes(cssUtils.colorTxtHint, cssUtils.marginLeft)}>
            <Icon className={classes(cssUtils.inlineIcon, css.locationIcon)}>location_on</Icon>
            {company.address.postalCode}
          </span>
        </MenuItem>
      ))}
    </Menu>
  )
}
