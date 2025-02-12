import {useEffect, useState} from "react";
import {ScButton} from "./Button";
import {Dialog, DialogActions, DialogContent, DialogTitle, MenuItem} from "@mui/material";
import {Datepicker} from "./Datepicker";
import {useI18n} from "../core/i18n";
import dayjs from 'dayjs';
import format from "date-fns/format";

interface QuickRange {
  label: string;
  start?: Date;
  end?: Date;
}

interface SuperPeriodPickerProps {
  start?: Date | undefined
  end?: Date | undefined
  onChange: (start: Date | undefined, end: Date | undefined) => void
  label?: [string, string]
}

const computeTitle = (selectedPredefinedPeriod?: string, start?: Date, end?: Date) => {
  if (!start && !end) {
    return 'Sélectionner une période'
  } else if (selectedPredefinedPeriod) {
    return selectedPredefinedPeriod
  } else if (start && !end) {
    return `Depuis le ${format(start, 'yyyy-MM-dd')}`
  } else if (!start && end) {
    return `Jusqu'au ${format(end, 'yyyy-MM-dd')}`
  } else if (start && end) {
    return `Du ${format(start, 'yyyy-MM-dd')} au ${format(end, 'yyyy-MM-dd')}`
  } else {
    return 'NOPE'
  }
}

export const SuperPeriodPicker = ({start, end, onChange, label}: SuperPeriodPickerProps) => {
  const { m } = useI18n()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedPredefinedPeriod, setSelectedPredefinedPeriod] = useState<string | undefined>()
  const [selectedStart, setSelectedStart] = useState<Date | undefined>(start)
  const [selectedEnd, setSelectedEnd] = useState<Date | undefined>(end)

  useEffect(() => {
    setSelectedStart(start)
    setSelectedEnd(end)
  }, [start, end])

  const selectedRange = computeTitle(selectedPredefinedPeriod, start, end)

  const handleOpenDialog = () => {
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }

  const handleQuickRange = (range: QuickRange) => {
    setSelectedPredefinedPeriod(range.label)
    onChange(range.start, range.end)
    return handleCloseDialog()
  }

  const handleCustomDateChange = (newStartDate?: Date, newEndDate?: Date) => {
    setSelectedPredefinedPeriod(undefined)
    onChange(newStartDate, newEndDate)
    return handleCloseDialog()
  };

  const quickRanges: QuickRange[] = [
    { label: 'Aujourd\'hui', start: dayjs().startOf('day').toDate(), end: dayjs().endOf('day').toDate() },
    { label: 'Depuis le début de la semaine', start: dayjs().startOf('week').toDate(), end: dayjs().endOf('week').toDate() },
    { label: 'Depuis le début du mois', start: dayjs().startOf('month').toDate(), end: dayjs().endOf('month').toDate() },
    { label: 'Les 6 derniers mois', start: dayjs().subtract(6, 'month').toDate(), end: dayjs().toDate() },
    { label: `L'année dernière (${dayjs().subtract(1, 'year').toDate().getFullYear()})`, start: dayjs().subtract(1, 'year').startOf('year').toDate(), end: dayjs().subtract(1, 'year').endOf('year').toDate() },
  ]

  return (
    <div className="my-2">
      <ScButton icon='calendar_month' sx={{height: '40px'}} fullWidth={true} variant='outlined' onClick={handleOpenDialog}>{selectedRange}</ScButton>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth='sm' fullWidth={true}>
        <DialogTitle>Sélectionner une période</DialogTitle>
        <DialogContent>
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
            </div>
            <div className="border-l-2 border-gray-300">
              {quickRanges.map((range, index) => (
                <MenuItem key={index} onClick={() => handleQuickRange(range)}>
                  {range.label}
                </MenuItem>
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <ScButton onClick={handleCloseDialog}>Annuler</ScButton>
          <ScButton variant='contained' onClick={() => handleCustomDateChange(selectedStart, selectedEnd)}>Appliquer</ScButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}