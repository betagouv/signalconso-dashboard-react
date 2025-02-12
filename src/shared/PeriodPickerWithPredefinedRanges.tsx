import { useEffect, useState } from 'react'
import { ScButton } from './Button'
import { MenuItem, Popover } from '@mui/material'
import { Datepicker } from './Datepicker'
import { useI18n } from '../core/i18n'
import dayjs from 'dayjs'
import format from 'date-fns/format'
import {
  AnalyticActionName,
  EventCategories,
  FiltrageSignalementsActions,
  trackEvent,
} from '../core/plugins/Matomo'
import { useConnectedContext } from '../core/context/ConnectedContext'

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
      start: dayjs().startOf('day').toDate(),
      end: dayjs().endOf('day').toDate(),
    },
    {
      label: 'Depuis le début de la semaine',
      start: dayjs().startOf('week').toDate(),
      end: dayjs().endOf('week').toDate(),
    },
    {
      label: 'Depuis le début du mois',
      start: dayjs().startOf('month').toDate(),
      end: dayjs().endOf('month').toDate(),
    },
    {
      label: 'Les 6 derniers mois',
      start: dayjs().subtract(6, 'month').toDate(),
      end: dayjs().toDate(),
    },
    {
      label: `L'année dernière (${dayjs().subtract(1, 'year').toDate().getFullYear()})`,
      start: dayjs().subtract(1, 'year').startOf('year').toDate(),
      end: dayjs().subtract(1, 'year').endOf('year').toDate(),
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
          <div className="flex mb-2">
            <span className="text-sm w-[50%] italic">
              Sélectionnez une ou des dates puis cliquez sur APPLIQUER
            </span>
            <div className="flex">
              <span className="text-sm mr-4">ou</span>
              <span className="text-sm italic">
                Cliquez sur une période prédéfinie
              </span>
            </div>
          </div>
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
              <div className="mt-8 flex justify-end gap-2">
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
            <div className="border-l-2 border-gray-300">
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
