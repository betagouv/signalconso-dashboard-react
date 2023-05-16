export interface ReportNode {
  name: string
  count: number
  id: string
  tags: string[]
  children: ReportNode[]
}