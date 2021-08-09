import {textOverflowMiddleCropping} from '../../../helper/utils'

export enum FileOrigin {
  Consumer = 'consumer',
  Professional = 'professional',
}

export interface UploadedFile {
  id: string
  filename: string
  loading: boolean
  origin: FileOrigin
}

export const displayedFilename = (f: UploadedFile) => {
  return textOverflowMiddleCropping(f.filename, 32)
}

export const displayedFilenameSmall = (f: UploadedFile) => {
  return textOverflowMiddleCropping(f.filename, 12)
}
