import { Paper, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {ReportStatus} from '@signal-conso/signalconso-api-sdk-js'
import {capitalize, classes} from '../../core/helper/utils'
import {styleUtils} from '../../core/theme'
import {useMemo} from 'react'

const useStyles = makeStyles((t: Theme) => ({
  root: {
    whiteSpace: 'nowrap',
    borderRadius: 40,
    paddingTop: t.spacing(1 / 1.5),
    paddingBottom: t.spacing(1 / 1.5),
    paddingRight: t.spacing(2),
    paddingLeft: t.spacing(2),
    fontWeight: 'bold',
    letterSpacing: '1px',
    display: 'inline-flex',
    minHeight: 24,
    alignItems: 'center',
    color: 'white',
    // fontSize: styleUtils(t).fontSize.big,
  },
  border: {
    // border: `1px solid ${t.palette.divider}`,
  },
  dense: {
    fontWeight: '500' as any,
    fontSize: styleUtils(t).fontSize.small,
    padding: t.spacing(0, 1, 0, 1),
  },
  fullWidth: {
    width: '100%',
  },
  inSelectOptions: {
    marginTop: -10,
    marginBottom: -10,
  },
}))

interface ReportStatusChipProps {
  status: ReportStatus
  dense?: boolean
  className?: string
  fullWidth?: boolean
  inSelectOptions?: boolean
  elevation?: number
}

export const reportStatusColor = {
  [ReportStatus.NA]: '#a1a1a1',
  [ReportStatus.EmployeeConsumer]: '#a1a1a1',
  [ReportStatus.InProgress]: '#f57c00',
  [ReportStatus.Transmitted]: '#f57c00',
  [ReportStatus.ToReviewedByPro]: '#f57c00',
  [ReportStatus.ClosedForPro]: '#03a9f4',
  [ReportStatus.Unread]: '#03a9f4',
  [ReportStatus.NotConcerned]: '#03a9f4',
  [ReportStatus.Accepted]: '#4caf50',
  [ReportStatus.Rejected]: '#4caf50',
  [ReportStatus.UnreadForPro]: '#d32f2f',
  [ReportStatus.Ignored]: '#d32f2f',
}

export const getReportStatusColor = (reportStatus: ReportStatus): string => {
  return reportStatusColor[reportStatus]
}

export const ReportStatusChip = ({
  status,
  elevation = 0,
  fullWidth,
  dense,
  className,
  inSelectOptions,
}: ReportStatusChipProps) => {
  const css = useStyles()
  const statusLabel = useMemo(() => capitalize(status.replace('Signalement ', ''), false), [status])
  return (
    <Paper
      elevation={elevation}
      aria-label="Statut du signalement"
      className={classes(
        className,
        css.root,
        elevation === 0 && css.border,
        inSelectOptions && css.inSelectOptions,
        dense && css.dense,
        fullWidth && css.fullWidth,
      )}
      style={{background: reportStatusColor[status]}}
    >
      {statusLabel}
    </Paper>
  )
}
