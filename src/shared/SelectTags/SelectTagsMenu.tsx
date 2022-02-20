import {alpha, Icon, IconButton, IconProps, Menu, MenuItem, Theme} from '@mui/material'
import {ReportTag} from '@signal-conso/signalconso-api-sdk-js'
import {Enum} from '@alexandreannic/ts-utils/lib/common/enum/Enum'
import {useI18n} from '../../core/i18n'
import {Txt} from 'mui-extension/lib/Txt/Txt'

export type SelectTagsMenuValue = 'included' | 'excluded' | undefined

export type SelectTagsMenuValues = Partial<{ [key in ReportTag]: SelectTagsMenuValue }>

interface ScSelectTagsMenuProps {
  onClose: () => void
  onChange: (_: SelectTagsMenuValues) => void
  open: boolean
  value?: SelectTagsMenuValues
  anchorEl: HTMLElement | null
}

const TagButton = ({
  children,
  color,
  sx,
  status = 'default',
  ...props
}: {
  status?: 'active' | 'inactive' | 'default'
  children: string,
  color: (t: Theme) => string
} & Pick<IconProps, 'sx' | 'onClick'>) => {
  const parsedColor = status === 'active' ? color : (t: Theme) => t.palette.text.disabled
  return (
    <IconButton {...props} size="small" sx={{
      color: parsedColor,
      border: t => `1px solid ${alpha(parsedColor(t), .3)}`,
      ...(status === 'active') && {
        boxShadow: t => `inset 0 0 0 1px ${parsedColor(t)}`,
        borderColor: t => parsedColor(t),
      },
      ...(status !== 'active') && {
        opacity: .5,
      },
      ...sx,
    }}>
      <Icon fontSize="small">{children}</Icon>
    </IconButton>
  )
}

export const SelectTagsMenu = ({
  onClose,
  onChange,
  open,
  value,
  anchorEl,
}: ScSelectTagsMenuProps) => {
  const {m} = useI18n()

  const handleChange = (tag: ReportTag, v: SelectTagsMenuValue) => {
    onChange({...value, [tag]: value?.[tag] ? undefined : v})
  }

  const iff = <T, >(
    tag: ReportTag,
    {included, excluded, notdefined}: {included: T, excluded: T, notdefined: T},
  ): T => {
    if (value?.[tag] === 'included') return included
    if (value?.[tag] === 'excluded') return excluded
    return notdefined
  }

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {(Enum.keys(ReportTag) as ReportTag[]).map(tag =>
        <MenuItem
          key={tag}
          // sx={iff(ReportTag.ReponseConso, {
          //   excluded: {background: (t: Theme) => alpha(t.palette.error.main, .4)},
          //   included: {background: (t: Theme) => alpha(t.palette.success.light, .4)},
          //   notdefined: {},
          // })}
        >
          <TagButton
            status={iff(tag, {
              excluded: 'inactive',
              included: 'active',
              notdefined: 'default',
            })}
            color={t => t.palette.success.light}
            sx={{mr: 1}}
            onClick={() => handleChange(tag, 'included')}
          >
            add
          </TagButton>
          <TagButton
            status={iff(tag, {
              excluded: 'active',
              included: 'inactive',
              notdefined: 'default',
            })}
            color={t => t.palette.error.main}
            sx={{mr: 1}}
            onClick={() => handleChange(tag, 'excluded')}
          >
            remove
          </TagButton>
          <Txt
            size="big"
            sx={{
              flex: 1,
              ...value?.[tag] === undefined && {
                color: t => t.palette.text.secondary,
              },
              ...value?.[tag] === 'excluded' && {
                color: t => t.palette.text.disabled,
                textDecoration: 'line-through',
              },
              ...value?.[tag] === 'included' && {
                fontWeight: t => t.typography.fontWeightBold,
              },
            }}
          >
            {m.reportTagDesc[tag]}
          </Txt>
        </MenuItem>,
      )}
    </Menu>
  )
}
