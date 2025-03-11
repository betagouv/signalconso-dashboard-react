import { Icon } from '@mui/material'
import { ReportElementRow } from 'shared/tinyComponents'
import { Train } from '../../core/client/report/Report'
import { useI18n } from '../../core/i18n'

export function ReportTrain({ train }: { train: Train }) {
  return (
    <ReportElementRow label="Train concerné">
      <TrainValue train={train} />
    </ReportElementRow>
  )
}

export function ReportTrainPro({ train }: { train: Train }) {
  const { m } = useI18n()
  return (
    <div>
      <span>Train concerné : </span>
      <TrainValue train={train} />
    </div>
  )
}

function TrainValue({ train }: { train: Train }) {
  const { m } = useI18n()
  const text =
    train.train === 'TER'
      ? m.Ter[train.ter as unknown as keyof typeof m.Ter]
      : train.train === 'TRAIN_DE_NUIT'
        ? m.NightTrain[train.nightTrain as unknown as keyof typeof m.NightTrain]
        : m.Train[train.train as unknown as keyof typeof m.Train]
  return (
    <span>
      <Icon fontSize="small" className="mb-[-5px] mr-1 ml-[-2px] ">
        train
      </Icon>
      {text}
    </span>
  )
}
