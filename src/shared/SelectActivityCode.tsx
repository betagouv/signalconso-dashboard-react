import { Autocomplete, Chip, Skeleton, Tooltip } from '@mui/material'
import { ScInput } from './ScInput'
import { Txt } from '../alexlibs/mui-extension'
import { forwardRef } from 'react'
import { useMemoFn } from '../alexlibs/react-hooks-lib'
import { AutocompleteProps } from '@mui/material/Autocomplete'
import { useQuery } from '@tanstack/react-query'

interface Props
  extends Pick<
    AutocompleteProps<string, true, false, false>,
    'value' | 'defaultValue' | 'className' | 'style' | 'onChange' | 'fullWidth'
  > {
  label?: string
}

export const SelectActivityCode = forwardRef((props: Props, ref) => {
  const _activityCodes = useQuery({
    queryKey: ['activityCodes'],
    queryFn: () => import('../core/activityCodes').then((_) => _.activityCodes),
  })

  const activityCodes = useMemoFn(_activityCodes.data, (_) =>
    Object.keys(_).sort(),
  )
  const activities = _activityCodes.data

  return (
    <>
      {_activityCodes.isPending ? (
        <Skeleton height={50} />
      ) : (
        activityCodes &&
        activities && (
          <Autocomplete
            {...props}
            ref={ref}
            multiple
            options={activityCodes}
            getOptionLabel={(option) => option + activities[option]}
            renderInput={(params) => (
              <ScInput {...params} label={props.label} />
            )}
            renderOption={(props, option: string) => (
              <Tooltip title={activities[option]} key={props.id}>
                <li {...props}>
                  <Txt bold>{option}</Txt>
                  <Txt truncate color="hint">
                    &nbsp;-&nbsp;{activities[option]}
                  </Txt>
                </li>
              </Tooltip>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  size="small"
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        )
      )}
    </>
  )
})
