import * as React from 'react'
import {useEffect, useMemo, useState} from 'react'
import {createStyles, Icon, InputAdornment, makeStyles, TextField, Theme} from '@material-ui/core'
import {SelectCompaniesByProMenu} from './SelectCompaniesByProMenu'
import {useI18n} from '../../core/i18n'
import {CompanyWithAccessLevel} from '../../core/api'
import {fromNullable} from 'fp-ts/lib/Option'
import {groupBy} from '../../core/lodashNamedExport'
import {siretToSiren} from '../../core/helper/utils'

export interface SelectDepartmentsProps {
  accessibleCompanies: CompanyWithAccessLevel[]
  placeholder?: string
  label?: string
  values?: string[]
  readonly?: boolean
  onChange: (_: string[]) => void
  className?: string
  fullWidth?: boolean
}

const useStyles = makeStyles((t: Theme) =>
  createStyles({
    adornment: {
      height: 20,
      color: t.palette.text.secondary,
      verticalAlign: 'top',
    },
  }),
)

export const SelectCompaniesByPro = ({
  accessibleCompanies,
  placeholder,
  label,
  values,
  className,
  readonly,
  onChange,
  fullWidth,
}: SelectDepartmentsProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  let $input: HTMLElement | undefined = undefined
  const css = useStyles()
  const {m} = useI18n()
  const [innerValues, setInnerValues] = useState<string[]>()

  useEffect(() => {
    setInnerValues(values ?? [])
  }, [values])

  const open = (event: any) => setAnchorEl(event.currentTarget)

  const close = () => {
    setAnchorEl(null)
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
        label={label ?? m.siret}
        onClick={open}
        value={fromNullable(innerValues)
          .filter(_ => _.length > 0)
          .map(_ => `(${_.length}) ${_.join(', ')}`)
          .getOrElse('')}
        disabled={readonly}
        inputRef={(n: any) => ($input = n ?? undefined)}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <Icon className={css.adornment}>arrow_drop_down</Icon>
            </InputAdornment>
          ),
        }}
      />
      <SelectCompaniesByProMenu
        accessibleCompanies={accessibleCompanies}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={close}
        onChange={_ => {
          onChange(_)
          setInnerValues(_)
        }}
        initialValues={values}
      />
    </>
  )
}
