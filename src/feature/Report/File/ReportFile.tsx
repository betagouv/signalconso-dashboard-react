import {Box, Button, Icon, Tooltip} from '@mui/material'
import {extensionToType, FileType, reportFileConfig} from './reportFileConfig'
import {useConnectedContext} from '../../../core/context/ConnectedContext'
import React, {useEffect} from 'react'
import {makeSx, Modal} from '../../../alexlibs/mui-extension'
import {useToast} from '../../../core/toast'
import {useI18n} from '../../../core/i18n'
import {UploadedFile} from '../../../core/client/file/UploadedFile'
import {ScOption} from 'core/helper/ScOption'
import {ReportFileDeleteButton} from './ReportFileDeleteButton'
import {useMutation} from '@tanstack/react-query'

export interface ReportFileProps {
  file: UploadedFile
  onRemove?: (file: UploadedFile) => void
}

const css = makeSx({
  image: {
    display: 'inline-flex',
    border: t => '1px solid black',
    borderRadius: '0 !important',
    height: reportFileConfig.cardSize,
    width: reportFileConfig.cardSize,
    color: t => t.palette.text.disabled,
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
      boxShadow: t => t.shadows[4],
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

export const ReportFile = ({file, onRemove}: ReportFileProps) => {
  const fileType = extensionToType(file.filename)
  const {apiSdk} = useConnectedContext()
  const _remove = useMutation({
    mutationFn: apiSdk.secured.document.remove,
    onSuccess: () => onRemove?.(file),
  })
  const {toastError} = useToast()
  const {m} = useI18n()

  const fileUrl = ScOption.from(apiSdk.public.document.getLink(file)).toUndefined()

  const RemoveButton = () => {
    return onRemove ? <ReportFileDeleteButton filename={file.filename} onConfirm={() => _remove.mutate(file)} /> : <></>
  }

  const DownloadButton = () => {
    return (
      <Button size={'small'} href={fileUrl}>
        <Icon fontSize="inherit" className="mr-0.5">
          download
        </Icon>
        <span>{m.download.toLowerCase()}</span>
      </Button>
    )
  }

  useEffect(() => {
    ScOption.from(_remove.error).map(toastError)
  }, [_remove.error])

  return (
    <div className="flex justify-center items-center flex-col mr-2">
      {fileType === FileType.Image ? (
        <div className="block relative py-2">
          <Tooltip title={file.filename} placement="top">
            <Button
              sx={css.image}
              // Matomo tracks all clicks on links
              // But these filenames are potentially sensitive
              className="matomo_ignore"
            >
              <Modal
                PaperProps={{style: {overflow: 'visible', maxHeight: '90vh'}}}
                maxWidth="md"
                cancelLabel={m.close}
                content={_ => <Box component="img" src={fileUrl} alt={file.filename} />}
              >
                <div className="flex items-center justify-center bg-cover h-full w-full">
                  <div className={`absolute inset-0 bg-cover`} style={{backgroundImage: `url(${fileUrl})`}} />
                  <Icon className="m-100" sx={css.imgImage}>
                    image
                  </Icon>
                </div>
              </Modal>
            </Button>
          </Tooltip>
        </div>
      ) : (
        <Tooltip title={file.filename}>
          <a target={'blank'} href={fileUrl} className="flex flex-col m-2">
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
        </Tooltip>
      )}
      <DownloadButton />
      <RemoveButton />
    </div>
  )
}
