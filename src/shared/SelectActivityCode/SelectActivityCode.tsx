import { Autocomplete, Skeleton } from '@mui/material';
import {ScInput} from '../Input/ScInput'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {Chip, Tooltip} from '@mui/material'
import {forwardRef, useEffect} from 'react'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {AutocompleteProps} from '@mui/material/Autocomplete'
import {useMemoFn} from '../hooks/UseMemoFn'

interface Props extends Pick<AutocompleteProps<string, true, false, false>,
  | 'value'
  | 'defaultValue'
  | 'className'
  | 'style'
  | 'placeholder'
  | 'onChange'
  | 'fullWidth'> {
  label?: string
}

export const SelectActivityCode = forwardRef((props: Props, ref) => {
  const _activityCodes = useFetcher(() => import('../../core/activityCodes').then(_ => _.activityCodes))
  useEffect(() => {
    _activityCodes.fetch()
  }, [])

  const activityCodes = useMemoFn(_activityCodes.entity, _ => Object.keys(_).sort())
  const activities = _activityCodes.entity

  return (
    <>
      {_activityCodes.loading ? (
        <Skeleton height={50}/>
      ) : activityCodes && activities && (
        <Autocomplete
          {...props}
          ref={ref}
          multiple
          options={activityCodes}
          getOptionLabel={option => option + activities[option]}
          renderInput={params => <ScInput {...params} label={props.label} small/>}
          renderOption={(props, option: string) => (
            <Tooltip title={activities[option]}>
              <li {...props}>
                <Txt bold>{option}</Txt>
                <Txt truncate color="hint">&nbsp;-&nbsp;{activities[option]}</Txt>
              </li>
            </Tooltip>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip size="small" variant="outlined" label={option} {...getTagProps({index})} />
            ))
          }
        />
      )}
    </>
  )
})
