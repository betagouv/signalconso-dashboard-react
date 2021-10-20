import * as React from 'react'
import {CSSProperties, useEffect} from 'react'
import {createStyles, Icon, InputAdornment, makeStyles, TextField, Theme} from '@material-ui/core'
import {useSetState, UseSetState} from '@alexandreannic/react-hooks-lib/lib'
import {SelectDepartmentsMenu} from './SelectDepartmentsMenu'
import {useI18n} from '../../core/i18n'

const useStyles = makeStyles((t: Theme) =>
  createStyles({
    adornment: {
      height: 20,
      color: t.palette.text.secondary,
      verticalAlign: 'top',
    },
  }),
)

export interface SelectDepartmentsProps {
  placeholder?: string
  selectAllLabel?: string
  values?: string[]
  style?: CSSProperties
  readonly?: boolean
  onChange: (_: string[]) => void
  className?: string
  fullWidth?: boolean
}

export const SelectDepartments = ({
  values,
  readonly,
  onChange,
  selectAllLabel,
  ...props
}: SelectDepartmentsProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  let $input: HTMLElement | undefined = undefined
  const css = useStyles()
  const indexValues: UseSetState<string> = useSetState<string>()
  const {m} = useI18n()

  useEffect(() => {
    indexValues.reset(values)
  }, [values])

  const open = (event: any) => setAnchorEl(event.currentTarget)

  const close = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <TextField
        {...props}
        variant="outlined"
        margin="dense"
        size="small"
        onClick={open}
        value={indexValues.toArray().join(', ') ?? ''}
        disabled={readonly}
        inputRef={(n: any) => ($input = n ?? undefined)}
        label={m.departments}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <Icon className={css.adornment}>arrow_drop_down</Icon>
            </InputAdornment>
          ),
        }}
      />
      <SelectDepartmentsMenu
        selectAllLabel={selectAllLabel}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={close}
        onChange={onChange}
        initialValues={values}
      />
    </>
  )
}
