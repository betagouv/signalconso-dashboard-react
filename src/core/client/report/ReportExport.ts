import { format } from 'date-fns-tz'

export function generateZipFileName(): string {
  return format(new Date(), 'dd-MM-yy').concat('_').concat('export.zip')
}
