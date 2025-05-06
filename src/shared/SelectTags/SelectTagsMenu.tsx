import {
  alpha,
  Icon,
  IconButton,
  IconButtonProps,
  IconProps,
  Menu,
  MenuItem,
  SxProps,
  Theme,
} from '@mui/material'
import { objectKeysUnsafe } from 'core/helper'
import { useEffect, useState } from 'react'
import { Txt } from '../../alexlibs/mui-extension'
import { outdatedTags, ReportTag } from '../../core/client/report/Report'
import { useI18n } from '../../core/i18n'

type SelectTagsMenuValue = 'included' | 'excluded' | undefined

export type SelectTagsMenuValues = Partial<{
  [key in ReportTag]: SelectTagsMenuValue
}>

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
  children: string
  color: (t: Theme) => string
} & Pick<IconProps, 'sx' | 'onClick'> &
  Pick<IconButtonProps, 'aria-label'>) => {
  const parsedColor =
    status === 'active' ? color : (t: Theme) => t.palette.text.disabled
  return (
    <IconButton
      {...props}
      size="small"
      sx={{
        color: parsedColor,
        border: (t) => `1px solid ${alpha(parsedColor(t), 0.3)}`,
        ...(status === 'active' && {
          boxShadow: (t) => `inset 0 0 0 1px ${parsedColor(t)}`,
          borderColor: (t) => parsedColor(t),
        }),
        ...(status !== 'active' && {
          opacity: 0.5,
        }),
        ...sx,
      }}
    >
      <Icon fontSize="small">{children}</Icon>
    </IconButton>
  )
}

function getSelectableTags() {
  const reponseConsoTag = ReportTag.ReponseConso
  const tagsWithoutReponseConso = (
    objectKeysUnsafe(ReportTag) as ReportTag[]
  ).filter((_) => _ !== reponseConsoTag && !outdatedTags.includes(_))
  return [reponseConsoTag, ...tagsWithoutReponseConso]
}

export const SelectTagsMenu = ({
  onClose,
  onChange,
  open,
  value,
  anchorEl,
}: ScSelectTagsMenuProps) => {
  const { m } = useI18n()

  const [innerValue, setInnerValue] = useState<
    SelectTagsMenuValues | undefined
  >()

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  const handleChange = (tag: ReportTag, v: SelectTagsMenuValue) => {
    const newValue = {
      ...innerValue,
      [tag]: value?.[tag] === v ? undefined : v,
    }
    setInnerValue(newValue)
    onChange(newValue)
  }

  const switchTagValue = <T,>(
    tag: ReportTag,
    {
      included,
      excluded,
      notdefined,
    }: { included: T; excluded: T; notdefined: T },
  ): T => {
    if (innerValue?.[tag] === 'included') return included
    if (innerValue?.[tag] === 'excluded') return excluded
    return notdefined
  }

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {getSelectableTags().map((tag) => (
        <MenuItem key={tag}>
          <TagButton
            aria-label="Inclure le tag"
            status={switchTagValue(tag, {
              excluded: 'inactive',
              included: 'active',
              notdefined: 'default',
            })}
            color={(t) => t.palette.success.light}
            sx={{ mr: 1 }}
            onClick={() => handleChange(tag, 'included')}
          >
            add
          </TagButton>
          <TagButton
            aria-label="Exclure le tag"
            status={switchTagValue(tag, {
              excluded: 'active',
              included: 'inactive',
              notdefined: 'default',
            })}
            color={(t) => t.palette.error.main}
            sx={{ mr: 1 }}
            onClick={() => handleChange(tag, 'excluded')}
          >
            remove
          </TagButton>
          <Txt
            size="big"
            sx={{
              flex: 1,
              ...switchTagValue<SxProps<Theme>>(tag, {
                excluded: {
                  color: (t) => t.palette.text.disabled,
                  textDecoration: 'line-through',
                },
                included: {
                  fontWeight: (t) => t.typography.fontWeightBold,
                },
                notdefined: {
                  color: (t) => t.palette.text.secondary,
                },
              }),
            }}
          >
            {m.reportTagDesc[tag]}
          </Txt>
        </MenuItem>
      ))}
    </Menu>
  )
}
