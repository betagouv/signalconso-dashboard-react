import {Box} from '@mui/material'
import {useEffect, useRef, useState} from 'react'
import {FileOrigin, UploadedFile} from '../../../core/client/file/UploadedFile'
import {useConnectedContext} from '../../../core/context/ConnectedContext'
import {useI18n} from '../../../core/i18n'
import {Id} from '../../../core/model'
import {ReportFile} from './ReportFile'
import {ReportFileAdd} from './ReportFileAdd'

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
  const attachmentRef = useRef<any>()
  const {connectedUser} = useConnectedContext()
  useEffect(() => {
    setInnerFiles(files)
  }, [files])

  useEffect(() => {
    if (attachmentRef.current && window.location.href.includes('anchor=attachment')) {
      attachmentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'center',
      })
    }
  }, [attachmentRef])

  const newFile = (f: UploadedFile) => {
    onNewFile(f)
    setInnerFiles(prev => [f, ...(prev ?? [])])
  }

  const removeFile = (f: UploadedFile) => {
    onRemoveFile(f)
    setInnerFiles(prev => prev?.filter(_ => _.id !== f.id))
  }

  return (
    <div className="mb-4">
      <Box ref={attachmentRef} className="flex flex-wrap gap-2">
        {innerFiles
          ?.filter(_ => _.origin === fileOrigin)
          .map(_ => {
            // Pro is the only user who can remove file. Pro can only remove its own file
            // In order to prevent Admin / Agent from removing pro / consumer file
            const canRemove = !hideAddBtn && fileOrigin === FileOrigin.Professional && connectedUser.isPro
            return <ReportFile key={_.id} file={_} onRemove={canRemove ? removeFile : undefined} />
          })}
        {!hideAddBtn && <ReportFileAdd reportId={reportId} fileOrigin={fileOrigin} onUploaded={newFile} />}
      </Box>
      {hideAddBtn && innerFiles?.length === 0 && <p className="">{m.noAttachment}</p>}
    </div>
  )
}
