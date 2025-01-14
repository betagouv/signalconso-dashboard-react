export interface ReportNode {
  name: string
  label: string
  overriddenCategory?: string
  count: number
  reclamations: number
  id?: string
  tags: string[]
  children: ReportNode[]
}

export interface ReportNodes {
  fr: ReportNode[]
  en: ReportNode[]
}
