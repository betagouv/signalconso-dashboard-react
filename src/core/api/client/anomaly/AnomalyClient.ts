import {
  Anomaly,
  ApiClientApi,
  Category,
  CompanyKinds,
  ReportTag,
  Subcategory,
  SubcategoryInformation,
  SubcategoryInput,
} from '../..'
import anomaliesJSON from '../anomaly/yml/anomalies.json'
import {lazy} from '../../helper/Lazy'

export class AnomalyClient {
  constructor(private client: ApiClientApi) {}

  readonly getAnomalies = lazy(() => Promise.resolve((anomaliesJSON as any).list.map(AnomalyClient.enrichAnomaly) as Anomaly[]))

  readonly getCategories = lazy(() =>
    Promise.resolve(this.getAnomalies().then(_ => _.filter(anomaly => !anomaly.information).map(anomaly => anomaly.category))),
  )

  private static readonly askCompanyKindIfMissing = (anomaly: Category, tags: ReportTag[]): Category => {
    if (!anomaly.subcategories && !anomaly.companyKind && !AnomalyClient.instanceOfSubcategoryInformation(anomaly)) {
      return {
        ...anomaly,
        description: undefined,
        subcategoriesTitle: 'Est-ce que votre problème concerne une entreprise sur internet ?',
        subcategories: [
          {
            ...anomaly,
            title: 'Oui',
            companyKind: CompanyKinds.WEBSITE,
            example: undefined,
          },
          {
            ...anomaly,
            title: 'Non, pas sur internet',
            companyKind: tags.indexOf(ReportTag.ProduitDangereux) === -1 ? CompanyKinds.SIRET : CompanyKinds.LOCATION,
            example: undefined,
          },
        ],
      } as Category
    }
    return {
      ...anomaly,
      subcategories: anomaly.subcategories?.map(_ => ({
        ..._,
        ...AnomalyClient.askCompanyKindIfMissing(_, [...tags, ...((anomaly as Subcategory).tags ?? [])]),
      })),
    }
  }

  private static readonly propagateCompanyKinds = (anomaly: Category): Category => {
    return {
      ...anomaly,
      subcategories: anomaly.subcategories
        ?.map(_ => ({..._, companyKind: _.companyKind || anomaly.companyKind}))
        ?.map(_ => ({..._, ...AnomalyClient.propagateCompanyKinds(_)})),
    }
  }

  private static readonly enrichAnomaly = (anomaly: Category): Category =>
    AnomalyClient.askCompanyKindIfMissing(AnomalyClient.propagateCompanyKinds(anomaly), [])

  static readonly instanceOfSubcategoryInput = (_?: Category): _ is SubcategoryInput => {
    return !!(_ as SubcategoryInput)?.detailInputs
  }

  static readonly instanceOfSubcategoryInformation = (_?: Category): _ is SubcategoryInformation => {
    return !!(_ as SubcategoryInformation)?.information
  }

  static readonly instanceOfAnomaly = (_?: Category): _ is Anomaly => {
    return !!(_ as Anomaly)?.category
  }
}
