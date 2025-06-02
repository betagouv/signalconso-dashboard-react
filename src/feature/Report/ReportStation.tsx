import { Icon } from '@mui/material'
import { ReportElementRow } from 'shared/tinyComponents'

export function ReportStation({ station }: { station: string }) {
  return (
    <ReportElementRow label="Gare concernée">
      <StationValue station={station} />
    </ReportElementRow>
  )
}

export function ReportStationPro({ station }: { station: string }) {
  return (
    <div>
      <span>Gare concernée : </span>
      <StationValue station={station} />
    </div>
  )
}

function StationValue({ station }: { station: string }) {
  return (
    <span>
      <Icon fontSize="small" className="mb-[-3px] mr-1 -ml-px ">
        subway
      </Icon>
      {station}
    </span>
  )
}
