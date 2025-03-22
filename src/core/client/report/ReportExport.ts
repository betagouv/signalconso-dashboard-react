import { ReportSearch } from './ReportSearch'
import { format } from 'date-fns-tz'

export function generateZipFileName(reportFilter?: ReportSearch): string {
  const tags = addPrefix('tags', reportFilter?.withTags?.join('_'))

  const departments = addPrefix(
    'departments',
    reportFilter?.departments?.join('_'),
  )

  const company = addPrefix('company', reportFilter?.siretSirenList?.join('_'))

  const category = addPrefix('category', reportFilter?.category)

  const name = departments.concat(company).concat(category).concat(tags)

  return format(new Date(), 'dd-MM-yy')
    .concat('_')
    .concat(
      name && name.length < 60 ? name.trim().concat('.zip') : 'export.zip',
    )
}

function addPrefix(prefix: string, s: string | undefined) {
  return s && s != '' ? `${prefix}_${s}` : ''
}
