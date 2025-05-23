import { Box, Button, Icon, Tooltip } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { ScOption } from 'core/helper/ScOption'
import { useEffect } from 'react'
import { Modal, makeSx } from '../../../alexlibs/mui-extension'
import { UploadedFile } from '../../../core/client/file/UploadedFile'
import { useConnectedContext } from '../../../core/context/connected/connectedContext'
import { useToast } from '../../../core/context/toast/toastContext'
import { useI18n } from '../../../core/i18n'
import { ReportFileDeleteButton } from './ReportFileDeleteButton'
import { ReportFileUnavailable } from './ReportFileUnavailable'
import { FileType, extensionToType, reportFileConfig } from './reportFileConfig'

interface ReportFileProps {
  file: UploadedFile
  isNotYetLinkedToReport: boolean
  onRemove?: (file: UploadedFile) => void
}

const css = makeSx({
  image: {
    display: 'inline-flex',
    border: (t) => '1px solid black',
    borderRadius: '0 !important',
    height: reportFileConfig.cardSize,
    width: reportFileConfig.cardSize,
    color: (t) => t.palette.text.disabled,
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
      boxShadow: (t) => t.shadows[4],
    },
  },
  imgImage: {
    color: '#00b50f',
  },
  imgPdf: {
    color: '#db4537',
  },
  imgDoc: {
    color: '#4185f3',
  },
})

export const ReportFile = ({
  file,
  onRemove,
  isNotYetLinkedToReport,
}: ReportFileProps) => {
  const fileType = extensionToType(file.filename)
  const { api: apiSdk } = useConnectedContext()
  const _remove = useMutation({
    mutationFn: (file: UploadedFile) =>
      isNotYetLinkedToReport
        ? apiSdk.public.attachements.removeFileNotYetUsedInReport(file)
        : apiSdk.secured.document.removeFileUsedInReport(file),
    onSuccess: () => onRemove?.(file),
  })
  const { toastError } = useToast()
  const { m } = useI18n()

  const fileUrl = isNotYetLinkedToReport
    ? apiSdk.public.attachements.getUrlOfFileNotYetUsedInReport(file)
    : apiSdk.secured.document.getUrlOfFileUsedInReport(file)

  const RemoveButton = () => {
    return onRemove ? (
      <ReportFileDeleteButton
        filename={file.filename}
        onConfirm={() => _remove.mutate(file)}
      />
    ) : (
      <></>
    )
  }

  const DownloadButton = () => {
    return (
      <Button size={'small'} href={fileUrl}>
        <Icon fontSize="inherit" className="mr-0.5">
          download
        </Icon>
        <span>{m.download}</span>
      </Button>
    )
  }

  useEffect(() => {
    ScOption.from(_remove.error).map(toastError)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_remove.error])

  const ReportFileImage = () => {
    return (
      <div className="block relative py-2">
        <Button
          sx={css.image}
          // Matomo tracks all clicks on links
          // But these filenames are potentially sensitive
          className="matomo_ignore"
          disabled={!file.isScanned}
        >
          <Modal
            PaperProps={{ style: { overflow: 'visible', maxHeight: '90vh' } }}
            maxWidth="md"
            cancelLabel={m.close}
            content={(_) => <img src={fileUrl} alt={file.filename} />}
          >
            <div className="flex items-center justify-center bg-cover h-full w-full">
              <img
                className={`absolute inset-0 bg-cover`}
                src={fileUrl}
                alt={`Miniature de l'image ${file.filename}`}
              />
              <Icon className="m-100" sx={css.imgImage}>
                image
              </Icon>
            </div>
          </Modal>
        </Button>
      </div>
    )
  }

  const ReportFileOther = () => {
    return (
      <a
        target={'blank'}
        href={fileUrl}
        className="flex flex-col m-2"
        onClick={(e) => {
          if (!file.isScanned) {
            e.preventDefault()
          }
        }}
      >
        <Box sx={css.image}>
          <div className="flex items-center justify-center bg-cover h-full w-full">
            {(() => {
              switch (fileType) {
                case FileType.PDF: {
                  return <Icon sx={css.imgPdf}>picture_as_pdf</Icon>
                }
                case FileType.Doc: {
                  return <Icon sx={css.imgDoc}>article</Icon>
                }
                default: {
                  return <Icon>insert_drive_file</Icon>
                }
              }
            })()}
          </div>
        </Box>
      </a>
    )
  }

  return (
    <Tooltip title={file.filename} placement="top">
      <div className="flex justify-center items-center flex-col mr-2">
        {file.isScanned ? (
          <>
            {fileType === FileType.Image ? (
              <ReportFileImage />
            ) : (
              <ReportFileOther />
            )}
            <DownloadButton />
            <RemoveButton />
          </>
        ) : (
          <div className="flex flex-col items-center">
            <ReportFileUnavailable />
            <div style={{ visibility: 'hidden' }}>
              <DownloadButton />
              <RemoveButton />
            </div>
          </div>
        )}
      </div>
    </Tooltip>
  )
}
