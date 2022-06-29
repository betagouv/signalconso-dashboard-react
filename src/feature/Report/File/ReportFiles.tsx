import {FileOrigin, Id, UploadedFile} from '@signal-conso/signalconso-api-sdk-js'
import {Box} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {ReportFileAdd} from './ReportFileAdd'
import {ReportFile} from './ReportFile'
import {useI18n} from '../../../core/i18n'
import {Txt} from '../../../alexlibs/mui-extension'

export interface ReportFilesProps {
  files?: UploadedFile[]
  onNewFile?: (f: UploadedFile) => void
  onRemoveFile?: (f: UploadedFile) => void
  reportId: Id
  fileOrigin: FileOrigin
  hideAddBtn?: boolean
}

export const ReportFiles = ({
  reportId,
  fileOrigin,
  files,
  hideAddBtn,
  onRemoveFile = () => void 0,
  onNewFile = () => void 0,
}: ReportFilesProps) => {
  const [innerFiles, setInnerFiles] = useState<UploadedFile[]>()
  const {m} = useI18n()

  useEffect(() => {
    setInnerFiles(files)
  }, [files])

  const newFile = (f: UploadedFile) => {
    onNewFile(f)
    setInnerFiles(prev => [f, ...(prev ?? [])])
  }

  const removeFile = (f: UploadedFile) => {
    onRemoveFile(f)
    setInnerFiles(prev => prev?.filter(_ => _.id !== f.id))
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
        }}
      >
        {innerFiles
          ?.filter(_ => _.origin === fileOrigin)
          .map(_ => (
            <ReportFile key={_.id} file={_} onRemove={hideAddBtn ? undefined : removeFile} />
          ))}
        {!hideAddBtn && <ReportFileAdd reportId={reportId} fileOrigin={fileOrigin} onUploaded={newFile} />}
      </Box>
      {hideAddBtn && innerFiles?.length === 0 && (
        <Txt block color="hint" sx={{my: 1}}>
          {m.noAttachment}
        </Txt>
      )}
    </>
  )
}
