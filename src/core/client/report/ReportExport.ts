import { ReportSearch } from './ReportSearch'
import { format } from 'date-fns-tz'

export function generateZipFileName(reportFilter?: ReportSearch): string {
  const tags = addPrefix('tags', reportFilter?.withTags?.join('_'))

  const departments = addPrefix(
    'departments',
    reportFilter?.departments?.join('_'),
  )

  const siren = addPrefix('siren', reportFilter?.siretSirenList?.join('_'))

  const category = addPrefix('category', reportFilter?.category)

  const name = departments.concat(siren).concat(category).concat(tags)

  console.log(name.trim().concat('.zip'))

  return format(new Date(), 'dd-MM-yy')
    .concat('_')
    .concat(
      name && name.length < 60 ? name.trim().concat('.zip') : 'export.zip',
    )
}

function addPrefix(prefix: string, s: string | undefined) {
  return s ? `${prefix}_${s}` : ''
}
