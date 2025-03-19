export interface ReportNode {
  name: string
  label: string
  overriddenCategory?: string
  count: number
  reclamations: number
  id?: string
  tags: string[]
  children: ReportNode[]
  isBlocking: boolean
}

export interface ReportNodes {
  fr: ReportNode[]
  en: ReportNode[]
}
