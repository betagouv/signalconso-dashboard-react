import { format } from 'date-fns-tz'

export function generateZipFileName(): string {
  return format(new Date(), 'dd-MM-yy').concat('_').concat('export.zip')
}

export function generatePdfFileName(): string {
  return format(new Date(), 'dd-MM-yy').concat('_').concat('export.pdf')
}
