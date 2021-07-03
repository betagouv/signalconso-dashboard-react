export type Index<T> = {[key: string]: T}

export const dateToYYYYMMDD = (date?: Date): string | undefined => date ? date.toISOString().split('T')[0] : undefined

export const dateToApi = dateToYYYYMMDD

export const getHostFromUrl = (url?: string) => {
  return url
    ?.replace('http://', '')
    .replace('https://', '')
    .replace('www.', '')
    .split(/[/?#]/)[0]
}

export const cleanObject = <T extends object>(obj: T): Partial<T> => {
  return Object.entries(obj)
    .filter(([, _]) =>
      _ !== undefined &&
      _ !== null &&
      _ !== '' &&
      (!Array.isArray(_) || !!_.filter(v => v !== undefined).length)
    )
    .reduce((acc, [key, value]) => ({...acc, [key]: value}), {})
}

export const toQueryString = (obj: any): string => {
  if (!obj) return ''
  return '?' + Object.keys(obj)
    .filter(k => obj[k] !== undefined)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&')
}

export const extractApiAddress = (address: string): string => {
  const matches = address.match(/^[^-]*?-(.*?)-[^-]*$/)
  return matches ? matches[1] : address
  // const split = address.split(' - ')
  // return split.length === 2 ? split[0] : split.length === 3 ? split[1] : address
}

export const directDownloadBlob = (blob: Blob): void => {
  const url = window.URL.createObjectURL(new Blob([blob], {type: 'application/pdf'}))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'file.pdf')
  document.body.appendChild(link)
  link.click()
}
