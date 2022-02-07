import {ReportTag} from '@signal-conso/signalconso-api-sdk-js'
import {Label, LabelProps} from '../Label/Label'
import {useI18n} from '../../core/i18n'

interface ReportTagProps extends Omit<LabelProps, 'children'> {
  tag: string
}

export const reportTagColor = {
  [ReportTag.LitigeContractuel]: '#a1a1a1',
  [ReportTag.Hygiene]: '#a1a1a1',
  [ReportTag.ProduitDangereux]: '#d32f2f',
  [ReportTag.DemarchageADomicile]: '#a1a1a1',
  [ReportTag.DemarchageTelephonique]: '#a1a1a1',
  [ReportTag.Ehpad]: '#a1a1a1',
  [ReportTag.AbsenceDeMediateur]: '#a1a1a1',
  [ReportTag.Bloctel]: '#4caf50',
  [ReportTag.Influenceur]: '#a1a1a1',
  [ReportTag.ReponseConso]: '#03a9f4',
  [ReportTag.Internet]: '#a1a1a1',
  [ReportTag.ProduitIndustriel]: '#a1a1a1',
  [ReportTag.ProduitAlimentaire]: '#a1a1a1',
  [ReportTag.CompagnieAerienne]: '#a1a1a1',
}

function fromString(name: string): ReportTag | undefined {
  return Object.entries(ReportTag).find(([key, value]) => value === name)?.[1]
}

export const ReportTagLabel = ({tag, style, ...props}: ReportTagProps) => {
  const {m} = useI18n()
  let tagOrUndefined = fromString(tag)
  return tagOrUndefined ? (
    <Label
      {...props}
      style={{
        fontWeight: '400' as any,
        color: 'black',
        background: 'white',
        border: `2px solid`,
        borderColor: reportTagColor[tagOrUndefined],
        ...style,
      }}
    >
      {m.reportTagDesc[tagOrUndefined]}
    </Label>
  ) : (
    <Label {...props} style={{fontWeight: '400' as any, color: 'black', background: 'white', border: `2px solid`, ...style}}>
      {tag}
    </Label>
  )
}
