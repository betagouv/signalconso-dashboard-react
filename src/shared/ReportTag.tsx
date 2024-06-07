import {Label, LabelProps} from './Label'
import {useI18n} from '../core/i18n'
import {ReportTag} from '../core/client/report/Report'

interface ReportTagProps extends Omit<LabelProps, 'children'> {
  tag: ReportTag
}

export const reportTagColor = {
  [ReportTag.LitigeContractuel]: '#a1a1a1',
  [ReportTag.Hygiene]: '#a1a1a1',
  [ReportTag.ProduitDangereux]: '#d32f2f',
  [ReportTag.BauxPrecaire]: '#d32f2f',
  [ReportTag.DemarchageADomicile]: '#a1a1a1',
  [ReportTag.DemarchageTelephonique]: '#a1a1a1',
  [ReportTag.DemarchageInternet]: '#a1a1a1',
  [ReportTag.Ehpad]: '#a1a1a1',
  [ReportTag.AbsenceDeMediateur]: '#a1a1a1',
  [ReportTag.Bloctel]: '#4caf50',
  [ReportTag.Influenceur]: '#a1a1a1',
  [ReportTag.ReponseConso]: '#03a9f4',
  [ReportTag.Internet]: '#a1a1a1',
  [ReportTag.ProduitIndustriel]: '#a1a1a1',
  [ReportTag.ProduitAlimentaire]: '#a1a1a1',
  [ReportTag.CompagnieAerienne]: '#a1a1a1',
  [ReportTag.Resiliation]: '#a1a1a1',
  [ReportTag.OpenFoodFacts]: '#a1a1a1',
  [ReportTag.TransitionEcologique]: '#a1a1a1',
  [ReportTag.ProduitPerime]: '#a1a1a1',
  [ReportTag.CommandeEffectuee]: '#a1a1a1',
  [ReportTag.ImpressionTicket]: '#a1a1a1',
  [ReportTag.QuantiteNonConforme]: '#a1a1a1',
  [ReportTag.AppelCommercial]: '#a1a1a1',
  [ReportTag.Prix]: '#a1a1a1',
  [ReportTag.AlimentationMaterielAnimaux]: '#a1a1a1',
}

export const ReportTagLabel = ({tag, style, ...props}: ReportTagProps) => {
  const {m} = useI18n()
  return (
    <Label
      {...props}
      style={{
        fontWeight: '400' as any,
        color: 'black',
        background: 'white',
        border: `2px solid`,
        borderColor: reportTagColor[tag],
        ...style,
      }}
    >
      {m.reportTagDesc[tag]}
    </Label>
  )
}
