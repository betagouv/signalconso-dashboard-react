export interface ReportNode {
  name: string
  count: number
  reclamations: number
  id?: string
  tags: string[]
  children: ReportNode[]
}
