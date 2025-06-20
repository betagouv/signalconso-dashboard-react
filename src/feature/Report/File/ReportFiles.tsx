import { Box } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import {
  FileOrigin,
  UploadedFile,
} from '../../../core/client/file/UploadedFile'
import { useConnectedContext } from '../../../core/context/connected/connectedContext'
import { useI18n } from '../../../core/i18n'
import { Id } from '../../../core/model'
import { ReportFile } from './ReportFile'
import { ReportFileAdd } from './ReportFileAdd'

interface ReportFilesProps {
  files?: UploadedFile[]
  onNewFile?: (f: UploadedFile) => void
  onRemoveFile?: (f: UploadedFile) => void
  reportId: Id
  fileOrigin: FileOrigin
  hideAddBtn?: boolean
  filesAreNotYetLinkedToReport?: boolean
}

export const ReportFiles = ({
  reportId,
  fileOrigin,
  files,
  hideAddBtn,
  onRemoveFile = () => void 0,
  onNewFile = () => void 0,
  filesAreNotYetLinkedToReport = false,
}: ReportFilesProps) => {
  const { api: apiSdk } = useConnectedContext()

  const _refreshUnscannedFiles = useMutation({
    mutationFn: apiSdk.secured.document.listFiles,
    onSuccess: (files) => {
      const scannedFiles = files.filter((_) => _.isScanned)
      if (scannedFiles.length > 0) {
        setInnerFiles((prev) => {
          // Filter out any files already in the list
          const filteredFiles = prev
            ? prev.filter(
                (existingFile) =>
                  !scannedFiles.map((_) => _.id).includes(existingFile.id),
              )
            : []
          // Return the updated list with new scannedFiles at the end
          return [...filteredFiles, ...scannedFiles]
        })
      }
    },
  })

  const [innerFiles, setInnerFiles] = useState<UploadedFile[]>()
  const { m } = useI18n()
  const attachmentRef = useRef<any>(undefined)
  const { connectedUser } = useConnectedContext()

  useEffect(() => {
    setInnerFiles(files)
  }, [files])

  useEffect(() => {
    const unScannedFiles = innerFiles?.filter((_) => !_.isScanned)
    const hasUnScannedFiles = unScannedFiles ? unScannedFiles.length > 0 : false

    if (unScannedFiles && hasUnScannedFiles) {
      const interval = setInterval(() => {
        _refreshUnscannedFiles.mutate(unScannedFiles.map((_) => _.id))
      }, 10000)
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerFiles])

  useEffect(() => {
    if (
      attachmentRef.current &&
      window.location.href.includes('anchor=attachment')
    ) {
      attachmentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'center',
      })
    }
  }, [attachmentRef])

  const newFile = (f: UploadedFile) => {
    onNewFile(f)
    setInnerFiles((prev) => [f, ...(prev ?? [])])
  }

  const removeFile = (f: UploadedFile) => {
    onRemoveFile(f)
    setInnerFiles((prev) => prev?.filter((_) => _.id !== f.id))
  }

  return (
    <div className="mb-4">
      <Box ref={attachmentRef} className="flex flex-wrap gap-2">
        {innerFiles
          ?.filter((_) => _.origin === fileOrigin)
          .map((_) => {
            // Admins & Pro are the only users who can remove file. Pro can only remove its own file
            // In order to prevent Agent from removing pro / consumer file
            const canRemove =
              connectedUser.isAdmin ||
              (!hideAddBtn &&
                fileOrigin === FileOrigin.Professional &&
                connectedUser.isPro)
            return (
              <ReportFile
                key={_.id}
                file={_}
                onRemove={canRemove ? removeFile : undefined}
                isNotYetLinkedToReport={filesAreNotYetLinkedToReport}
              />
            )
          })}
        {!hideAddBtn && (
          <ReportFileAdd
            reportId={reportId}
            fileOrigin={fileOrigin}
            onUploaded={newFile}
          />
        )}
      </Box>
      {hideAddBtn && innerFiles?.length === 0 && (
        <p className="">{m.noAttachment}</p>
      )}
    </div>
  )
}
