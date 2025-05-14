import { MenuItem, Popover } from '@mui/material'
import {
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subYears,
} from 'date-fns'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useConnectedContext } from '../core/context/connected/connectedContext'
import { useI18n } from '../core/i18n'
import {
  AnalyticActionName,
  EventCategories,
  FiltrageSignalementsActions,
  trackEvent,
} from '../core/plugins/Matomo'
import { ScButton } from './Button'
import { Datepicker } from './Datepicker'

interface QuickRange {
  label: string
  start?: Date
  end?: Date
}

interface PeriodPickerWithPredefinedRangesProps {
  start?: Date | undefined
  end?: Date | undefined
  onChange: (start: Date | undefined, end: Date | undefined) => void
  label?: [string, string]
}

const computeTitle = (
  selectedPredefinedPeriod?: string,
  start?: Date,
  end?: Date,
) => {
  if (!start && !end) {
    return 'Sélectionner une période'
  } else if (selectedPredefinedPeriod) {
    return selectedPredefinedPeriod
  } else if (start && !end) {
    return `Depuis le ${format(start, 'yyyy-MM-dd')}`
  } else if (!start && end) {
    return `Jusqu'au ${format(end, 'yyyy-MM-dd')}`
  } else {
    // start and end ARE defined
    return `Du ${format(start!, 'yyyy-MM-dd')} au ${format(end!, 'yyyy-MM-dd')}`
  }
}

export const PeriodPickerWithPredefinedRanges = ({
  start,
  end,
  onChange,
  label,
}: PeriodPickerWithPredefinedRangesProps) => {
  const { m } = useI18n()
  const { connectedUser } = useConnectedContext()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedPredefinedPeriod, setSelectedPredefinedPeriod] = useState<
    string | undefined
  >()
  const [selectedStart, setSelectedStart] = useState<Date | undefined>(start)
  const [selectedEnd, setSelectedEnd] = useState<Date | undefined>(end)

  useEffect(() => {
    setSelectedStart(start)
    setSelectedEnd(end)
  }, [start, end])

  const selectedRange = computeTitle(selectedPredefinedPeriod, start, end)

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const handleQuickRange = (range: QuickRange) => {
    trackEvent(
      connectedUser,
      EventCategories.Signalements,
      FiltrageSignalementsActions.periodePredefinie,
      AnalyticActionName.click,
      range.label,
    )
    setSelectedPredefinedPeriod(range.label)
    onChange(range.start, range.end)
    handleClosePopover()
  }

  const handleCustomDateChange = (newStartDate?: Date, newEndDate?: Date) => {
    trackEvent(
      connectedUser,
      EventCategories.Signalements,
      FiltrageSignalementsActions.datesPrecises,
      AnalyticActionName.click,
      `${newStartDate && format(newStartDate, 'yyyy-MM-dd')} - ${newEndDate && format(newEndDate, 'yyyy-MM-dd')}`,
    )
    setSelectedPredefinedPeriod(undefined)
    onChange(newStartDate, newEndDate)
    handleClosePopover()
  }

  const quickRanges: QuickRange[] = [
    {
      label: "Aujourd'hui",
      start: startOfDay(new Date()),
      end: undefined,
    },
    {
      label: 'Depuis le début de la semaine',
      start: startOfWeek(new Date(), { weekStartsOn: 1 }),
      end: undefined,
    },
    {
      label: 'Depuis le début du mois',
      start: startOfMonth(new Date()),
      end: undefined,
    },
    {
      label: 'Les 6 derniers mois',
      start: startOfDay(subMonths(new Date(), 6)),
      end: undefined,
    },
    {
      label: `L'année dernière (${subYears(new Date(), 1).getFullYear()})`,
      start: startOfYear(subYears(new Date(), 1)),
      end: endOfYear(subYears(new Date(), 1)),
    },
    {
      label: `Depuis toujours (réinitialiser)`,
      start: undefined,
      end: undefined,
    },
  ]

  return (
    <div className="my-2">
      <ScButton
        icon="calendar_month"
        sx={{ height: '40px' }}
        fullWidth={true}
        variant="outlined"
        onClick={handleOpenPopover}
      >
        {selectedRange}
      </ScButton>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className="p-4 max-w-xl">
          <div className="flex gap-4">
            <div>
              <Datepicker
                label={label?.[0] ?? m.start}
                fullWidth={true}
                value={start}
                onChange={(newStart?: Date) => setSelectedStart(newStart)}
                sx={{ marginRight: '-1px' }}
                InputProps={{
                  inputProps: { min: '1000-01-01' },
                  sx: (_) => ({
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 0,
                  }),
                }}
                timeOfDay="startOfDay"
              />

              <Datepicker
                label={label?.[1] ?? m.end}
                fullWidth={true}
                value={end}
                onChange={(newEnd?: Date) => setSelectedEnd(newEnd)}
                InputProps={{
                  inputProps: { min: '1000-01-01' },
                  sx: (_) => ({
                    borderBottomLeftRadius: 0,
                    borderTopLeftRadius: 0,
                  }),
                }}
                timeOfDay="endOfDay"
              />
              <div className="mt-2 flex justify-between gap-2">
                <ScButton onClick={handleClosePopover}>Annuler</ScButton>
                <ScButton
                  variant="contained"
                  onClick={() =>
                    handleCustomDateChange(selectedStart, selectedEnd)
                  }
                >
                  Appliquer
                </ScButton>
              </div>
            </div>
            <div role="menu" className="border-l-2 border-gray-300">
              {quickRanges.map((range, index) => (
                <MenuItem key={index} onClick={() => handleQuickRange(range)}>
                  {range.label}
                </MenuItem>
              ))}
            </div>
          </div>
        </div>
      </Popover>
    </div>
  )
}
