import { Train } from '../../core/client/report/Report'
import { Box, Icon, useTheme } from '@mui/material'
import { useI18n } from '../../core/i18n'

export function ReportTrain({ train }: { train: Train }) {
  const theme = useTheme()
  const { m } = useI18n()
  const trainLabel =
    train.train === 'TER'
      ? m.Ter[train.ter as unknown as keyof typeof m.Ter]
      : train.train === 'TRAIN_DE_NUIT'
        ? m.NightTrain[train.nightTrain as unknown as keyof typeof m.NightTrain]
        : m.Train[train.train as unknown as keyof typeof m.Train]
  return (
    <Box
      sx={{
        mt: theme.spacing(4),
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <Icon
        sx={{
          fontSize: 20,
          mr: 0.5,
        }}
      >
        train
      </Icon>
      Train concerné : {trainLabel}
    </Box>
  )
}
